import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { cleanup, fireEvent, render } from '@testing-library/react';

import { CurrencyInput, convertFormattedNumberToCents } from '../';

afterEach(cleanup);

describe('CurrencyInput', () => {
  it('matches the snapshot', () => {
    const { container } = render(
      <IntlProvider defaultLocale="en">
        <CurrencyInput />
      </IntlProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  describe('with a default value', () => {
    it('matches the snapshot', () => {
      const { container } = render(
        <IntlProvider defaultLocale="en">
          <CurrencyInput value={123456} />
        </IntlProvider>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('with changes on the input field', () => {
    it('updates state and calls onChange', () => {
      const changeMock = jest.fn();
      const { getByPlaceholderText } = render(
        <IntlProvider defaultLocale="en">
          <CurrencyInput placeholder="testInput" onChange={changeMock} />
        </IntlProvider>
      );
      const input = getByPlaceholderText('testInput');
      fireEvent.change(input, { target: { value: '150' } });

      expect(changeMock).toHaveBeenCalledWith(150);
      expect((input as HTMLInputElement).value).toBe('1.50');
    });

    it('should handle the visibility of placeholder', () => {
      const { getByPlaceholderText } = render(
        <IntlProvider defaultLocale="en">
          <CurrencyInput placeholder="the placeholder" onChange={jest.fn()} />
        </IntlProvider>
      );
      const input = getByPlaceholderText('the placeholder');
      expect((input as HTMLInputElement).value).toBe('the placeholder');
      fireEvent.change(input, { target: { value: '150' } });
      expect((input as HTMLInputElement).value).toBe('1.50');
      fireEvent.change(input, { target: { value: '0' } });
      expect((input as HTMLInputElement).value).toBe('the placeholder');
    });
  });
});

describe('convertFormattedNumberToCents', () => {
  it('returns 0 on invalid value', () => {
    const result = convertFormattedNumberToCents('asdf');
    expect(result).toBe(0);
  });
  it('removes everything thats not a number', () => {
    const result = convertFormattedNumberToCents('$11.2.2.2,33,44 €');
    expect(result).toBe(112223344);
  });
});
