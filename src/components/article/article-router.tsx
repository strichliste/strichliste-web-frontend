import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { ConnectedIdleTimer } from '../common/idle-timer';
import { ArticleEditFormView } from './article-edit-form-view';
import { ArticleList } from './article-list';

export function ArticleRouter(props: RouteComponentProps): JSX.Element {
  return (
    <>
      <ConnectedIdleTimer onTimeOut={() => props.history.push('/')} />
      <Switch>
        <Route path="/articles" exact={true} component={ArticleList} />
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
