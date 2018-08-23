import * as React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';

import {
  createConnectedComponent,
  getMockStore,
} from '../../../spec-configs/mock-store';
import {
  renderWithContext,
  renderWithIntl,
} from '../../../spec-configs/render';
import {
  ConnectedCreateCustomTransactionForm,
  CreateCustomTransactionForm,
} from '../create-custom-transaction-form';

afterEach(cleanup);

describe('CreateCustomTransactionForm', () => {
  it('matches the snapshot', () => {
    const store = getMockStore({});
    const Component = createConnectedComponent(
      ConnectedCreateCustomTransactionForm
    );
    const { container } = renderWithIntl(
      <Component isDeposit={true} userId={12} store={store} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('Connected CreateCustomTransactionForm', () => {
    describe('with deposit', () => {
      it('submits form with cents value', () => {
        const mock = jest.fn();
        const { getByPlaceholderText, getByText } = renderWithContext(
          <CreateCustomTransactionForm
            createTransaction={mock}
            isDeposit={true}
            userId={12}
          />,
          {}
        );
        const input = getByPlaceholderText('0');
        const button = getByText(
          'USER_TRANSACTION_CREATE_CUSTOM_DEPOSIT_BUTTON'
        );

        fireEvent.change(input, { target: { value: '1200' } });
        fireEvent.submit(button);

        expect(mock).toHaveBeenCalledWith(12, { amount: 1200 });
      });
    });
  });
  describe('with dispense', () => {
    it('submits form with negated cents value', async () => {
      const mock = jest.fn();
      const mockOnCreate = jest.fn();

      const { getByPlaceholderText, getByText } = renderWithContext(
        <CreateCustomTransactionForm
          transactionCreated={mockOnCreate}
          createTransaction={mock}
          isDeposit={false}
          userId={1}
        />,
        {}
      );
      const input = getByPlaceholderText('0');
      const button = getByText(
        'USER_TRANSACTION_CREATE_CUSTOM_DISPENSE_BUTTON'
      );

      fireEvent.change(input, { target: { value: '120' } });
      await fireEvent.submit(button);

      expect(mock).toHaveBeenCalledWith(1, { amount: -120 });
      expect(mockOnCreate).toHaveBeenCalled();
    });
  });
});
