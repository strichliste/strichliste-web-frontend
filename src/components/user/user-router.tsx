import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { ConnectedUserDetails } from '.';
import { ConnectedIdleTimer } from '../common/idle-timer';
import { CreateCustomTransaction } from './views/create-custom-transaction';
import { TransactionOverview } from './views/transaction-overview';
import { ConnectedUser } from './views/user';
import { ConnectedUserSearch } from './views/user-search';

export interface UserRouterProps {}

type Props = UserRouterProps & RouteComponentProps;

export function UserRouter(props: Props): JSX.Element {
  return (
    <>
      <ConnectedIdleTimer onTimeOut={() => props.history.push('/')} />
      <Switch>
        <Route
          path="/user/active"
          exact={true}
          render={props => <ConnectedUser {...props} isActive={true} />}
        />
        <Route
          path="/user/inactive"
          exact={true}
          render={props => <ConnectedUser {...props} isActive={false} />}
        />
        <Route
          path="/user/active/add"
          exact={true}
          render={props => (
            <ConnectedUser
              {...props}
              showCreateUserForm={true}
              isActive={true}
            />
          )}
        />
        <Route
          path="/user/inactive/add"
          exact={true}
          render={props => (
            <ConnectedUser
              {...props}
              showCreateUserForm={true}
              isActive={false}
            />
          )}
        />
        <Route
          path="/user/inactive"
          exact={true}
          render={props => <ConnectedUser {...props} isActive={false} />}
        />
        <Route
          path="/user/search"
          exact={true}
          component={ConnectedUserSearch}
        />
        <Route path="/user/:id" component={ConnectedUserDetails} />
        <Route
          path="/user/:id/transactions/:page"
          exact={true}
          component={TransactionOverview}
        />
        <Route
          path="/user/:id/:deposit"
          exact={true}
          component={CreateCustomTransaction}
        />
        <Redirect from="/" to="/user/active" />
      </Switch>
    </>
  );
}

export function UserArticleTransactionLink(props: { id: number }): JSX.Element {
  return (
    <Link to={`/user/${props.id}/article`}>
      <FormattedMessage id="USER_ARTICLE_LINK" />
    </Link>
  );
}

export function getUserDetailLink(id: number): string {
  return `/user/${id}`;
}

export type UserRouteProps = RouteComponentProps<{ id: string }>;
