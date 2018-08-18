import * as React from 'react';
import { connect } from 'react-redux';

import { DefaultThunkAction } from '../../store';
import { startCreatingUser } from '../../store/reducers';

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
        <div>
          <input
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            placeholder="user"
            type="text"
            required
          />
        </div>
        <div>
          <button> + </button>
        </div>
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
