import * as React from 'react';
import { RenderResult, cleanup, fireEvent } from '@testing-library/react';

import { render } from '../../../render';
import { Pager } from '../pager';
import { afterEach } from 'vitest';

afterEach(cleanup);

describe('Pager', () => {
  it('disables next if there are no more pages', () => {
    const { getByText } = renderWithIntl(
      <Pager currentPage={0} limit={5} itemCount={4} onChange={jest.fn()} />
    );
    const prev = getByText('PAGER_PREV', { exact: false });
    const next = getByText('PAGER_NEXT', { exact: false });
    expect(prev.hasAttribute('disabled')).toBeTruthy();
    expect(next.hasAttribute('disabled')).toBeTruthy();
  });

  it('disables pref if the current page is the first page', () => {
    const { getByText } = renderWithIntl(
      <Pager currentPage={0} limit={5} itemCount={10} onChange={jest.fn()} />
    );
    const prev = getByText('PAGER_PREV', { exact: false });
    const next = getByText('PAGER_NEXT', { exact: false });
    expect(prev.hasAttribute('disabled')).toBeTruthy();
    expect(next.hasAttribute('disabled')).toBeFalsy();
  });

  it('does not disable paging if current page is not the first and there are pages left', () => {
    const { getByText } = renderWithIntl(
      <Pager currentPage={2} limit={5} itemCount={40} onChange={jest.fn()} />
    );
    const prev = getByText('PAGER_PREV', { exact: false });
    const next = getByText('PAGER_NEXT', { exact: false });
    expect(prev.hasAttribute('disabled')).toBeFalsy();
    expect(next.hasAttribute('disabled')).toBeFalsy();
  });
  describe('handles click events', () => {
    const onChange = jest.fn();
    let result: RenderResult;
    beforeEach(() => {
      result = renderWithIntl(
        <Pager currentPage={2} limit={5} itemCount={40} onChange={onChange} />
      );
    });
    it('goes to next page on next click', () => {
      const next = result.getByText('PAGER_NEXT', { exact: false });

      fireEvent.click(next);
      expect(onChange).toBeCalledWith(3);
    });
    it('goes to prev page on prev click', () => {
      const prev = result.getByText('PAGER_PREV', { exact: false });

      fireEvent.click(prev);
      expect(onChange).toBeCalledWith(1);
    });
  });
});
