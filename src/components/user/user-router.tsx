import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { ConnectedUserDetails } from '.';
import { IdleTimer } from '../common/idle-timer';
import { CreateCustomTransaction } from '../views/create-custom-transaction';
import { TransactionOverview } from '../views/transaction-overview';
import { ConnectedUserTransaction } from '../views/user-transaction';

export interface UserRouterProps {}

type Props = UserRouterProps & RouteComponentProps<{}>;

export function UserRouter(props: Props): JSX.Element {
  return (
    <>
      <IdleTimer timeout={30000} onTimeOut={() => props.history.push('/')} />
      <Switch>
        <Route path="/user/:id" exact={true} component={ConnectedUserDetails} />
        <Route
          path="/user/:id/send_money_to_a_friend"
          exact={true}
          component={ConnectedUserTransaction}
        />
        <Route
          path="/user/:id/transactions"
          exact={true}
          component={TransactionOverview}
        />
        <Route
          path="/user/:id/:deposit"
          exact={true}
          component={CreateCustomTransaction}
        />
      </Switch>
    </>
  );
}
