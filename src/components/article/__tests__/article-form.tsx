import React from 'react';

import { ArticleForm } from '../article-form';
import { renderWithContext } from '../../../spec-configs/render';

describe('article form', () => {
  it('does not crash', () => {
    renderWithContext(<ArticleForm onCreated={() => {}} />, {});
  });
});
