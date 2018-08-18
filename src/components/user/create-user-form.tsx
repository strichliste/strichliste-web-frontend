import * as React from 'react';
import { connect } from 'react-redux';

import { DefaultThunkAction } from '../../store';
import { startCreatingUser } from '../../store/reducers';
import { Button, FormField } from '../ui';

interface ActionProps {
  startCreatingUser(name: string): DefaultThunkAction;
}

interface State {
  name: string;
}

type Props = ActionProps;

export class CreateUserForm extends React.Component<Props, State> {
  public state = {
    name: '',
  };

  public submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.startCreatingUser(this.state.name);
    this.setState({ name: '' });
  };

  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    console.log(this.props);

    return (
      <form onSubmit={this.submit}>
        <FormField>
          <input
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            placeholder="user"
            type="text"
            required
          />
        </FormField>
        <FormField>
          <Button> + </Button>
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
