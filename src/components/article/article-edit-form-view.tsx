import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ArticleForm } from './article-form';
import { Button, Arrow } from '../../bricks';
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
              <Arrow
                style={{
                  width: '0.8rem',
                  height: '0.8rem',
                  marginRight: '0.5rem',
                  transform: 'rotate(-180deg)',
                }}
              />
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
