import * as React from 'react';
import { afterEach, describe, test, expect, vi } from 'vitest';

import { render, cleanup, screen } from '../../../render';
import { ArticleValidator } from '../validator';

afterEach(cleanup);

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
describe('ArticleValidator', () => {
  describe('validates a user that buys article', () => {
    test('is valid if user has enough balance', () => {
      const mockRender = vi.fn();
      render(<ArticleValidator value={8} userId={'1'} render={mockRender} />);

      expect(mockRender).toHaveBeenCalledWith(true);
    });

    test('is invalid if user has not enough balance', () => {
      const mockRender = vi.fn();
      render(
        <ArticleValidator value={2010} userId={'1'} render={mockRender} />
      );
      expect(mockRender).toHaveBeenCalledWith(false);
    });
  });
  describe('validates a user that creates article', () => {
    test('is valid if article is cheaper than boundary', () => {
      const mockRender = vi.fn();
      render(<ArticleValidator value={80} render={mockRender} />);

      expect(mockRender).toHaveBeenCalledWith(true);
    });

    test('is invalid if article is more expensive then boundary', () => {
      const mockRender = vi.fn();
      render(<ArticleValidator value={20000} render={mockRender} />);
      expect(mockRender).toHaveBeenCalledWith(false);
    });
  });
});
