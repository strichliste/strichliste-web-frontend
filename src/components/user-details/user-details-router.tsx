import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import { RouteComponentProps, withRouter } from '../../routing';
import { PayPalTransaction } from '../paypal/paypal-transaction';
import { UserArticleTransaction } from '../user/views/user-article-transaction';
import { UserEditView } from '../user/views/user-edit-view';
import { ConnectedCreateCustomTransactionForm } from '../transaction';

// Rendered as a descendant of "/user/:id/*"; paths are relative to that match.
const RoutedUserArticleTransaction = withRouter(UserArticleTransaction);
const RoutedUserEditView = withRouter(UserEditView);

export function UserDetailRouter(): React.JSX.Element {
  return (
    <Routes>
      <Route path="article" element={<RoutedUserArticleTransaction />} />
      <Route path="edit" element={<RoutedUserEditView />} />
      <Route
        path="send_money_to_a_friend"
        element={<ConnectedCreateCustomTransactionForm />}
      />
      <Route path="paypal" element={<PayPalTransaction />} />
      <Route path="paypal/:amount" element={<PayPalTransaction />} />
    </Routes>
  );
}

export type UserRouteParams = RouteComponentProps<{ id: string }>;
