import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { ConnectedIdleTimer } from '../common/idle-timer';
import { ConnectedUserSearch } from '../user/views/user-search';
import { ArticleForm, ConnectedArticleForm } from '../views/article-form';
import { ConnectedArticleList } from './article-list';

export function ArticleRouter(props: RouteComponentProps<{}>): JSX.Element {
  return (
    <>
      <ConnectedIdleTimer onTimeOut={() => props.history.push('/')} />
      <Switch>
        <Route path="/articles" exact={true} component={ConnectedArticleList} />
        <Route
          path="/articles/add"
          exact={true}
          component={ConnectedArticleForm}
        />
        <Route
          path="/articles/:id"
          exact={true}
          component={ConnectedUserSearch}
        />
        <Route path="/articles/:id/edit" exact={true} component={ArticleForm} />
      </Switch>
    </>
  );
}
