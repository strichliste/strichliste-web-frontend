import { Button, theme } from 'bricks-of-sand';
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
import { FormField } from '../ui';

interface OwnProps {
  userId: number;
  onSave(): void;
}

interface StateProps {
  user: User | undefined;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  startUpdateUser(userId: number, params: UserUpdateParams): any;
}

export type UserEditFormProps = ActionProps & StateProps & OwnProps;

export class UserEditForm extends React.Component<
  UserEditFormProps,
  UserUpdateParams
> {
  public state = { name: '', email: '', isDisabled: false };

  public componentDidMount(): void {
    if (this.props.user) {
      this.setState({
        name: this.props.user.name,
        email: this.props.user.email || '',
        isDisabled: this.props.user.isDisabled || false,
      });
    }
  }

  public submit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const user = await this.props.startUpdateUser(
      this.props.userId,
      this.state
    );

    if (user && user.id) {
      this.props.onSave();
    }
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
                checked={this.state.isDisabled}
                onChange={e => this.setState({ isDisabled: e.target.checked })}
                type="checkbox"
              />
            </label>
            {this.state.isDisabled && (
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
