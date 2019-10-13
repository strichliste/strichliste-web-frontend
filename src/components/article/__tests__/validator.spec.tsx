import * as React from 'react';
import { cleanup } from '@testing-library/react';

import { renderWithContext } from '../../../spec-configs/render';
import { ArticleValidator } from '../validator';

afterEach(cleanup);

describe('ArticleValidator', () => {
  describe('validates a user that buys article', () => {
    it('is valid if user has enough balance', () => {
      const mockRender = jest.fn();
      renderWithContext(
        <ArticleValidator value={8} userId={'1'} render={mockRender} />,
        {
          user: {
            '1': {
              balance: 10,
            },
          },
        }
      );

      expect(mockRender).toHaveBeenCalledWith(true);
    });

    it('is invalid if user has not enough balance', () => {
      const mockRender = jest.fn();
      renderWithContext(
        <ArticleValidator value={2010} userId={'1'} render={mockRender} />,
        {
          user: {
            '1': {
              balance: 10,
            },
          },
        }
      );
      expect(mockRender).toHaveBeenCalledWith(false);
    });
  });
  describe('validates a user that creates article', () => {
    it('is valid if article is cheaper than boundary', () => {
      const mockRender = jest.fn();
      renderWithContext(
        <ArticleValidator value={80} render={mockRender} />,
        {}
      );

      expect(mockRender).toHaveBeenCalledWith(true);
    });

    it('is invalid if article is more expensive then boundary', () => {
      const mockRender = jest.fn();
      renderWithContext(
        <ArticleValidator value={20000} render={mockRender} />,
        {}
      );
      expect(mockRender).toHaveBeenCalledWith(false);
    });
  });
});
