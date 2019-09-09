import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { WrappedIdleTimer } from '../common/idle-timer';
import { UserMetricsView } from '../metrics';
import { UserDetails } from './user-details';
import { TransactionOverview } from './views/transaction-overview';
import { User } from './views/user';
import { useSettings } from '../../store';

export function UserRouter(): JSX.Element {
  return (
    <Switch>
      <Route
        path="/user/active"
        exact={true}
        render={props => <User {...props} isActive={true} />}
      />
      <Route
        path="/user/inactive"
        exact={true}
        render={props => <User {...props} isActive={false} />}
      />
      <Route
        path="/user/active/add"
        exact={true}
        render={props => (
          <>
            <WrappedIdleTimer />
            <User {...props} showCreateUserForm={true} isActive={true} />
          </>
        )}
      />
      <Route
        path="/user/inactive/add"
        exact={true}
        render={props => (
          <>
            <WrappedIdleTimer />
            <User {...props} showCreateUserForm={true} isActive={false} />
          </>
        )}
      />
      <Route
        path="/user/inactive"
        exact={true}
        render={props => <User {...props} isActive={false} />}
      />
      <Route
        path="/user/transactions/:id/:page"
        exact={true}
        render={props => (
          <>
            <WrappedIdleTimer />
            <TransactionOverview {...props} />
          </>
        )}
      />
      <Route
        path="/user/:id/metrics"
        render={() => (
          <>
            <WrappedIdleTimer />
            <UserMetricsView />
          </>
        )}
      />
      <Route
        path="/user/:id"
        render={props => (
          <>
            <WrappedIdleTimer />
            <UserDetails {...props} />
          </>
        )}
      />
      <Redirect from="/" to="/user/active" />
    </Switch>
  );
}

export function UserArticleTransactionLink(props: { id: number }): JSX.Element {
  return (
    <Link to={`/user/${props.id}/article`}>
      <FormattedMessage id="USER_ARTICLE_LINK" />
    </Link>
  );
}

export function getUserDetailLink(id: string): string {
  return `/user/${id}`;
}

export function getUserTransactionsLink(id: string, page: number = 0): string {
  return `/user/transactions/${id}/${page}`;
}

export function getUserPayPalLink(id: string): string {
  return `${getUserDetailLink(id)}/paypal`;
}

export type UserRouteProps = RouteComponentProps<{ id: string }>;

export function useUserDetailUrl(): (id: string) => string {
  const settings = useSettings();
  const redirect = settings.article.autoOpen ? '/article' : '';

  return (id: string) => getUserDetailLink(id) + redirect;
}
