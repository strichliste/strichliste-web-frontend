import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { withRouter } from '../../routing';
import { WrappedIdleTimer } from '../common/idle-timer';
import { ArticleEditFormView } from './article-edit-form-view';
import { ArticleList } from './article-list';

// ArticleEditFormView consumes v5-style router props via the shim.
// Routes are relative to the parent "/articles/*" match.
const RoutedArticleEditFormView = withRouter(ArticleEditFormView);

export function ArticleRouter(): React.JSX.Element {
  return (
    <>
      <WrappedIdleTimer />
      <Routes>
        <Route index element={<Navigate to="active" replace />} />
        <Route path="active" element={<ArticleList isActive={true} />} />
        <Route path="inactive" element={<ArticleList isActive={false} />} />
        <Route path="add" element={<RoutedArticleEditFormView />} />
        <Route path=":id/edit" element={<RoutedArticleEditFormView />} />
        <Route path="*" element={<Navigate to="active" replace />} />
      </Routes>
    </>
  );
}

export const getArticleFormRoute = (id: string | number) => {
  return `/articles/${id}/edit`;
};
