import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { PayPalTransaction } from '../paypal/paypal-transaction';
import { UserArticleTransaction } from '../user/views/user-article-transaction';
import { UserEditView } from '../user/views/user-edit-view';
import { CreateUserTransactionForm } from '../transaction';

export function UserDetailRouter(): JSX.Element {
  return (
    <Switch>
      <Route path="/user/:id/article" component={UserArticleTransaction} />
      <Route path="/user/:id/edit" exact={true} component={UserEditView} />
      <Route
        path="/user/:id/send_money_to_a_friend"
        exact={true}
        component={CreateUserTransactionForm}
      />
      <Route
        path="/user/:id/paypal"
        exact={true}
        component={PayPalTransaction}
      />
      <Route
        path="/user/:id/paypal/:amount"
        exact={true}
        component={PayPalTransaction}
      />
    </Switch>
  );
}

export type UserRouteParams = RouteComponentProps<{ id: string }>;
