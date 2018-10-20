import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { ConnectedUserDetails } from '.';
import { ConnectedIdleTimer } from '../common/idle-timer';
import { CreateCustomTransaction } from './views/create-custom-transaction';
import { TransactionOverview } from './views/transaction-overview';
import { ConnectedUser } from './views/user';
import { ConnectedUserArticleTransaction } from './views/user-article-transaction';
import { UserEditView } from './views/user-edit-view';
import { ConnectedUserSearch } from './views/user-search';
import { ConnectedUserTransaction } from './views/user-transaction';

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
        <Route path="/user/:id" exact={true} component={ConnectedUserDetails} />
        <Route path="/user/:id/edit" exact={true} component={UserEditView} />
        <Route
          path="/user/:id/article"
          exact={true}
          component={ConnectedUserArticleTransaction}
        />
        <Route
          path="/user/:id/send_money_to_a_friend"
          exact={true}
          component={ConnectedUserTransaction}
        />
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
