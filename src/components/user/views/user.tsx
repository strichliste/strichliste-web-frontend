import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { AppState, ThunkAction } from '../../../store';
import { startLoadingUsers } from '../../../store/reducers';
import { AutoGrid, Card, Column } from '../../ui';
import { ConnectedUserCard } from '../user-card';

interface OwnProps {
  stale: boolean;
}

interface StateProps {
  users: string[];
}

interface ActionProps {
  startLoadingUsers(stale?: boolean): ThunkAction<Promise<void>>;
}

type UserProps = OwnProps & StateProps & ActionProps & RouteComponentProps;
let lastStale: boolean;
export class User extends React.Component<UserProps> {
  public componentDidMount(): void {
    this.props.startLoadingUsers(this.props.stale);
  }

  public componentDidUpdate(): void {
    if (lastStale !== this.props.stale) {
      this.props.startLoadingUsers(this.props.stale);
    }
    lastStale = this.props.stale;
  }

  public render(): JSX.Element {
    return (
      <>
        <Column margin="1rem">
          <div>
            <Link to="/user/search">
              <FormattedMessage id="USER_SEARCH_LINK" />
            </Link>
          </div>
          {!this.props.stale ? (
            <Link to="/user/inactive">
              <FormattedMessage id="USER_INACTIVE_LINK" />
            </Link>
          ) : (
            <Link to="/active_users">
              <FormattedMessage id="USER_ACTIVE_LINK" />
            </Link>
          )}
        </Column>

        <Column margin="1rem">
          {this.props.stale ? (
            <FormattedMessage id="USER_INACTIVE" />
          ) : (
            <FormattedMessage id="USER_ACTIVE" />
          )}
        </Column>
        <AutoGrid rows="5rem" columns="10rem">
          <Link to="/user/create">
            <Card hover width="100%" height="6rem">
              +
            </Card>
          </Link>

          {this.props.users.map(id => (
            <Link key={id} to={'/user/' + id}>
              <ConnectedUserCard id={Number(id)} />
            </Link>
          ))}
        </AutoGrid>

        <Card margin="1rem">
          <Link to="/articles">
            <FormattedMessage id="ARTICLE_LINK" />
          </Link>
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps) => ({
  users: getUsers(state, props.stale),
});

function getUsers(state: AppState, stale: boolean): string[] {
  return Object.keys(state.user).filter(
    key => (state.user[key].balance === 0) === stale
  );
}

const mapDispatchToProps: ActionProps = {
  startLoadingUsers,
};

export const ConnectedUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
