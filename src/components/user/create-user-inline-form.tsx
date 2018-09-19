import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { startCreatingUser } from '../../store/reducers';
import { shadows, theme } from '../ui';

interface ActionProps {
  // tslint:disable-next-line:no-any
  startCreatingUser(name: string): any;
}

interface State {
  name: string;
  isActive: boolean;
}

type Props = ActionProps & RouteComponentProps;

type TriggerProps = Pick<State, 'isActive'>;
const TRANSITION = 'all 0.5s ease-out';
const Trigger = styled('div')<TriggerProps>(
  {
    display: 'flex',
    background: theme.white,
    transition: TRANSITION,
    boxShadow: shadows.level2,
    justifyContent: 'center',
    alignItems: 'center',
    height: '2rem',
    span: {
      padding: '1rem',
      transition: TRANSITION,
      fontSize: '2rem',
    },
    form: {
      overflow: 'hidden',
      transition: TRANSITION,
      input: {
        border: 'none',
      },
    },
  },
  props => ({
    width: props.isActive ? '10rem' : '2rem',
    borderRadius: props.isActive ? '4px' : '100%',
    span: {
      transform: props.isActive ? 'rotate(45deg)' : 'rotate(0deg)',
    },
    form: {
      width: props.isActive ? '9rem' : '0rem',
    },
  })
);

export class InlineCreateUserForm extends React.Component<Props, State> {
  public state = {
    name: '',
    isActive: false,
  };

  public submit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const user = await this.props.startCreatingUser(this.state.name);
    if (user && user.id) {
      this.deactivate();
      this.props.history.push(`/user/${user.id}`);
    }
  };

  public activate = () => {
    this.setState(state => ({ ...state, isActive: true }));
  };

  public deactivate = () => {
    this.setState({ isActive: false, name: '' });
  };

  public toggle = () => {
    if (this.state.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  };

  public render(): JSX.Element {
    const { isActive, name } = this.state;

    const form = (
      <form onSubmit={this.submit}>
        <FormattedMessage
          id="USER_CREATE_NAME_LABEL"
          children={text => (
            <input
              value={name}
              onChange={e =>
                this.setState({
                  name: e.target.value,
                })
              }
              placeholder={text as string}
              type="text"
              required
              autoFocus={true}
            />
          )}
        />
      </form>
    );

    return (
      <Trigger isActive={isActive}>
        {form}
        <span onClick={this.toggle}>+</span>
      </Trigger>
    );
  }
}

const mapDispatchToProps = {
  startCreatingUser,
};

export const ConnectedInlineCreateUserForm = withRouter(
  connect(
    undefined,
    mapDispatchToProps
  )(InlineCreateUserForm)
);
