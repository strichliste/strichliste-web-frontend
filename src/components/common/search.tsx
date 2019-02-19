import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { AppState } from '../../store';
import { User, getUserArray, startLoadingUsers } from '../../store/reducers';
import { getUserDetailLink } from '../user/user-router';
import { UserSearch } from '../user/user-selection';

interface StateProps {
  users: User[];
}

interface ActionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startLoadingUsers: any;
}

export type Props = ActionProps & StateProps & RouteComponentProps;

export class SearchInput extends React.Component<Props, {}> {
  public componentDidMount(): void {
    this.props.startLoadingUsers();
  }

  public render(): JSX.Element {
    return (
      <FormattedMessage
        id="SEARCH"
        children={placeholder => (
          <UserSearch
            placeholder={placeholder as string}
            onSelect={user =>
              this.props.history.push(getUserDetailLink(user.id))
            }
          />
        )}
      />
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  users: getUserArray(state),
});

const mapDispatchToProps = {
  startLoadingUsers,
};

export const ConnectedSearchInput = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchInput)
);
