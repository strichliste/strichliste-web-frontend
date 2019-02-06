import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { PayPalTransaction } from '../paypal/paypal-transaction';
import { ConnectedUserArticleTransaction } from '../user/views/user-article-transaction';
import { UserEditView } from '../user/views/user-edit-view';
import { ConnectedUserTransaction } from '../user/views/user-transaction';

export function UserDetailRouter(): JSX.Element {
  return (
    <Switch>
      <Route
        path="/user/:id/article"
        component={ConnectedUserArticleTransaction}
      />
      <Route path="/user/:id/edit" exact={true} component={UserEditView} />
      <Route
        path="/user/:id/send_money_to_a_friend"
        exact={true}
        component={ConnectedUserTransaction}
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
