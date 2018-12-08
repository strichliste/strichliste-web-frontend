import * as React from 'react';
import { Section } from '../../ui';
import { ConnectedArticleList } from '../article-list';

export function Articles(): JSX.Element {
  return (
    <>
      <Section>
        <ConnectedArticleList />
      </Section>
    </>
  );
}
