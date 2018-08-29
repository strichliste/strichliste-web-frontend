import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { ArticleForm, ConnectedArticleForm } from '../views/article-form';
import { ConnectedUserSearch } from '../views/user-search';
import { ConnectedArticleList } from './article-list';

export function ArticleRouter(props: RouteComponentProps<{}>): JSX.Element {
  return (
    <>
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
