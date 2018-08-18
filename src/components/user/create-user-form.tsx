import * as React from 'react';

export class CreateUserForm extends React.Component {
  public state = {};

  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    console.log(this.props);

    return (
      <form>
        <div>
          <input placeholder="user" type="text" required />
        </div>
        <div>
          <button> + </button>
        </div>
      </form>
    );
  }
}
