import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  User,
  UserUpdateParams,
  getUser,
  startUpdateUser,
} from '../../store/reducers';
import { Button, FormField, theme } from '../ui';

interface OwnProps {
  userId: number;
  onSave(): void;
}

interface StateProps {
  user: User | undefined;
}

interface ActionProps {
  startUpdateUser(userId: number, params: UserUpdateParams): void;
}

export type UserEditFormProps = ActionProps & StateProps & OwnProps;

export class UserEditForm extends React.Component<
  UserEditFormProps,
  UserUpdateParams
> {
  public state = { name: '', email: '', active: true };

  public componentDidMount(): void {
    if (this.props.user) {
      this.setState({
        name: this.props.user.name,
        email: this.props.user.email,
        active: this.props.user.active,
      });
    }
  }

  public submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.startUpdateUser(this.props.userId, this.state);
    this.props.onSave();
  };

  public render(): JSX.Element {
    return (
      <>
        <form onSubmit={this.submit}>
          <FormField>
            <label>
              <FormattedMessage id="USER_EDIT_NAME_LABEL" />
              <input
                value={this.state.name}
                onChange={e =>
                  this.setState({
                    name: e.target.value,
                  })
                }
                required
                type="text"
              />
            </label>
          </FormField>
          <FormField>
            <label>
              <FormattedMessage id="USER_EDIT_MAIL_LABEL" />
              <input
                value={this.state.email || ''}
                onChange={e => this.setState({ email: e.target.value })}
                type="email"
              />
            </label>
          </FormField>
          <FormField>
            <label>
              <FormattedMessage id="USER_EDIT_ACTIVE_LABEL" />
              <input
                checked={this.state.active}
                onChange={e => this.setState({ active: e.target.checked })}
                type="checkbox"
              />
            </label>
            {!this.state.active && (
              <FormattedMessage id="USER_EDIT_ACTIVE_WARNING" />
            )}
          </FormField>
          <FormField>
            <Button color={theme.green}>
              <FormattedMessage id="USER_EDIT_TRIGGER" />
            </Button>
          </FormField>
        </form>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  user: getUser(state, props.userId),
});

const mapDispatchToProps = {
  startUpdateUser,
};

export const ConnectedUserEditForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserEditForm);
