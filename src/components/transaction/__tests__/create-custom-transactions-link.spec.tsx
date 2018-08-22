import * as React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';

import { renderAndReturnContext } from '../../../spec-configs/render';
import { CreateCustomTransactionLink } from '../create-custom-transaction-link';

afterEach(cleanup);

describe('CreateCustomTransactionLink', () => {
  describe('with deposit', () => {
    it('matches the snapshot', () => {
      const { result, history } = renderAndReturnContext(
        <CreateCustomTransactionLink isDeposit />,
        {}
      );

      const button = result.getByText('?');
      fireEvent.click(button);

      expect(history.location.pathname).toBe('//deposit');
      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
  describe('with dispense', () => {
    it('matches the snapshot', () => {
      const { result, history } = renderAndReturnContext(
        <CreateCustomTransactionLink isDeposit={false} />,
        {}
      );

      const button = result.getByText('?');
      fireEvent.click(button);

      expect(history.location.pathname).toBe('//dispense');
      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});
