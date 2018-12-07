import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { ConnectedIdleTimer } from '../common/idle-timer';
import { ConnectedArticleList } from './article-list';
import { ArticleEditFormView } from './views/article-edit-form-view';

export function ArticleRouter(props: RouteComponentProps): JSX.Element {
  return (
    <>
      <ConnectedIdleTimer onTimeOut={() => props.history.push('/')} />
      <Switch>
        <Route path="/articles" exact={true} component={ConnectedArticleList} />
        <Route
          path="/articles/add"
          exact={true}
          component={ArticleEditFormView}
        />
        <Route
          path="/articles/:id/edit"
          exact={true}
          component={ArticleEditFormView}
        />
      </Switch>
    </>
  );
}
