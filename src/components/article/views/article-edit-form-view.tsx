import { Card } from 'bricks-of-sand';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BackButton } from '../../common';
import { FixedFooter } from '../../ui';
import { ConnectedArticleForm } from '../article-form';

export function ArticleEditFormView({
  match,
  history,
}: RouteComponentProps<{ id: string }>): JSX.Element {
  return (
    <>
      <Card>
        <ConnectedArticleForm
          onCreated={history.goBack}
          articleId={Number(match.params.id)}
        />
      </Card>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
