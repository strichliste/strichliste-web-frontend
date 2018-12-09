import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import {
  Button,
  Card,
  Flex,
  Input,
  PrimaryButton,
  withTheme,
} from 'bricks-of-sand';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { startCreatingUser } from '../../store/reducers';
import { AddIcon } from '../ui/icons/add';
import { EditIcon } from '../ui/icons/edit';

interface OwnProps {
  isActive: boolean;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  startCreatingUser: any;
}

interface State {
  name: string;
}

type Props = ActionProps & RouteComponentProps & OwnProps;

const TRANSITION = 'all 0.5s ease-out';
const Trigger = styled('div')<OwnProps>(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6rem',
    form: {
      overflow: 'hidden',
      transition: TRANSITION,
      input: {
        border: 'none',
      },
    },
  },
  props => ({
    borderRadius: props.isActive ? '4px' : '100%',
    svg: {
      fill: props.theme.white,
      transform: props.isActive ? 'rotate(45deg)' : 'rotate(0deg)',
    },
    form: {
      width: props.isActive ? '9rem' : '0rem',
    },
  })
);

const RedBlackButton = withTheme(
  styled(Button)<OwnProps>(
    {
      backgroundColor: 'none',
    },
    props => ({
      '&:hover': {
        background: props.isActive ? props.theme.red : props.theme.primary,
      },
      svg: {
        fill: props.theme.themedWhite,
      },
      background: props.isActive ? props.theme.red : props.theme.primary,
    })
  )
);

export class InlineCreateUserForm extends React.Component<Props, State> {
  public state = {
    name: '',
  };

  public submit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const user = await this.props.startCreatingUser(this.state.name);
    if (user && user.id) {
      this.props.history.push(`/user/${user.id}`);
    }
  };

  public toggle = () => {
    if (this.props.isActive) {
      this.props.history.goBack();
    } else {
      this.props.history.push(this.props.history.location.pathname + '/add');
    }
  };

  public render(): JSX.Element {
    const { name } = this.state;
    const { isActive } = this.props;

    const form = (
      <Card
        flex
        height="6rem"
        alignItems="center"
        margin="0 0 0 1rem"
        level="level3"
      >
        <form onSubmit={this.submit}>
          <FormattedMessage
            id="USER_CREATE_NAME_LABEL"
            children={text => (
              <Flex>
                <Input
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
                <PrimaryButton type="submit" isRound>
                  <EditIcon />
                </PrimaryButton>
              </Flex>
            )}
          />
        </form>
      </Card>
    );

    return (
      <Trigger isActive={isActive}>
        <RedBlackButton isActive={isActive} onClick={this.toggle} isRound>
          <AddIcon />
        </RedBlackButton>
        {isActive && form}
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
