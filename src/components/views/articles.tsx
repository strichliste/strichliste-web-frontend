import * as React from 'react';
import { ConnectedArticleList } from '../article/article-list';
import { BackButton } from '../common';
import { FixedFooter, Section } from '../ui';

export function Articles(): JSX.Element {
  return (
    <>
      <Section>
        <ConnectedArticleList />
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
