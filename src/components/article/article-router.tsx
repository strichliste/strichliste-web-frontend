import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { WrappedIdleTimer } from '../common/idle-timer';
import { ArticleEditFormView } from './article-edit-form-view';
import { ArticleList } from './article-list';

export function ArticleRouter(): JSX.Element {
  return (
    <>
      <WrappedIdleTimer />
      <Switch>
        <Route
          path="/articles/active"
          exact={true}
          component={() => <ArticleList isActive={true} />}
        />
        <Route
          path="/articles/inactive"
          exact={true}
          component={() => <ArticleList isActive={false} />}
        />
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
        <Redirect from="/articles" to="/articles/active" />
      </Switch>
    </>
  );
}

export const getArticleFormRoute = (id: string | number) => {
  return `/articles/${id}/edit`;
};
