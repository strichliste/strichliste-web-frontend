import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ArticleForm } from './article-form';
import { Button } from '../../bricks';
import { FormattedMessage } from 'react-intl';

export function ArticleEditFormView({
  match,
  history,
}: RouteComponentProps<{ id: string }>): JSX.Element {
  return (
    <>
      <div style={{ margin: '1rem' }}>
        <Button
          onClick={() => history.goBack()}
          children={
            <>
              &#8592;
              <FormattedMessage id="BACK_BUTTON" />
            </>
          }
        />
      </div>
      <div style={{ padding: '1rem' }}>
        <ArticleForm
          onCreated={history.goBack}
          articleId={Number(match.params.id)}
        />
      </div>
    </>
  );
}
