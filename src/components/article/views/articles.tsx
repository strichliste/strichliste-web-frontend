import * as React from 'react';
import { BackButton } from '../../common';
import { FixedFooter, Section } from '../../ui';
import { ConnectedArticleList } from '../article-list';

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
