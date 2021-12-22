import React from 'react';
import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '../../../render';
import { ArticleForm } from '../article-form';

afterEach(cleanup);

describe('article form', () => {
  test('does not crash', () => {
    const onCreated = vi.fn();
    render(<ArticleForm onCreated={onCreated} />);
    expect(screen.getByText('add new article')).toBeDefined();
  });
});
