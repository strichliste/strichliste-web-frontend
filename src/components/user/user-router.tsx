import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from '../../routing';
import { useSettings } from '../../queries';
import { WrappedIdleTimer } from '../common/idle-timer';
import { UserMetricsView } from '../metrics';
import { UserDetails } from './user-details';
import { TransactionOverview } from './views/transaction-overview';
import { User } from './views/user/user';

// User and the detail views consume v5-style router props; the shim supplies
// them from v7 hooks. Routes below are relative to the parent "/user/*" match.
const RoutedUser = withRouter(User);
const RoutedTransactionOverview = withRouter(TransactionOverview);
const RoutedUserDetails = withRouter(UserDetails);

export function UserRouter(): React.JSX.Element {
  return (
    <Routes>
      <Route index element={<Navigate to="active" replace />} />
      <Route path="active" element={<RoutedUser isActive={true} />} />
      <Route path="inactive" element={<RoutedUser isActive={false} />} />
      <Route
        path="active/add"
        element={
          <>
            <WrappedIdleTimer />
            <RoutedUser showCreateUserForm={true} isActive={true} />
          </>
        }
      />
      <Route
        path="inactive/add"
        element={
          <>
            <WrappedIdleTimer />
            <RoutedUser showCreateUserForm={true} isActive={false} />
          </>
        }
      />
      <Route
        path="transactions/:id/:page"
        element={
          <>
            <WrappedIdleTimer />
            <RoutedTransactionOverview />
          </>
        }
      />
      <Route
        path=":id/metrics"
        element={
          <>
            <WrappedIdleTimer />
            <UserMetricsView />
          </>
        }
      />
      <Route
        path=":id/*"
        element={
          <>
            <WrappedIdleTimer />
            <RoutedUserDetails />
          </>
        }
      />
      <Route path="*" element={<Navigate to="active" replace />} />
    </Routes>
  );
}

export function UserArticleTransactionLink(props: { id: number }): React.JSX.Element {
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
