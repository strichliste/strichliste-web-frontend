import * as React from 'react';
import { connect } from 'react-redux';

import { Button, theme } from 'bricks-of-sand';
import { FormattedMessage } from 'react-intl';
import { startCreatingUser } from '../../store/reducers';
import { FormField } from '../ui';
interface OwnProps {
  userCreated(id: number): void;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  startCreatingUser: any;
}

interface State {
  name: string;
}

type Props = OwnProps & ActionProps;

export class CreateUserForm extends React.Component<Props, State> {
  public state = {
    name: '',
  };

  public submit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const data = await this.props.startCreatingUser(this.state.name);
    if (data && data.id) {
      this.setState({ name: '' });
      this.props.userCreated(data.id);
    }
  };

  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <form onSubmit={this.submit}>
        <FormField>
          <label>
            <FormattedMessage id="USER_CREATE_NAME_LABEL" />
          </label>
          <input
            value={this.state.name}
            onChange={e =>
              this.setState({
                name: e.target.value,
              })
            }
            placeholder=""
            type="text"
            required
            autoFocus={true}
          />
        </FormField>
        <FormField>
          <Button color={theme.green}>
            <FormattedMessage id="USER_CREATE_TRIGGER" />
          </Button>
        </FormField>
      </form>
    );
  }
}

const mapDispatchToProps = {
  startCreatingUser,
};

export const ConnectedCreateUserForm = connect(
  undefined,
  mapDispatchToProps
)(CreateUserForm);
