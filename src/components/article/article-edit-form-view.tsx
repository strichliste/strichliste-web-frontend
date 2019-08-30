import { Card } from 'bricks-of-sand';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ArticleForm } from './article-form';

export function ArticleEditFormView({
  match,
  history,
}: RouteComponentProps<{ id: string }>): JSX.Element {
  return (
    <ArticleForm
      onCreated={history.goBack}
      articleId={Number(match.params.id)}
    />
  );
}
