import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ArticleForm } from './article-form';
import { Card } from '../../bricks';

export function ArticleEditFormView({
  match,
  history,
}: RouteComponentProps<{ id: string }>): JSX.Element {
  return (
    <Card>
      <ArticleForm
        onCreated={history.goBack}
        articleId={Number(match.params.id)}
      />
    </Card>
  );
}
