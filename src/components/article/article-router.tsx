import * as React from 'react';
import { Route, Switch } from 'react-router';
import { WrappedIdleTimer } from '../common/idle-timer';
import { ArticleEditFormView } from './article-edit-form-view';
import { ArticleList } from './article-list';

export function ArticleRouter(): JSX.Element {
  return (
    <>
      <WrappedIdleTimer />
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
