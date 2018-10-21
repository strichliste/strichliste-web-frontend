import * as React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';

import {
  createConnectedComponent,
  getMockStore,
} from '../../../spec-configs/mock-store';
import { renderWithContext } from '../../../spec-configs/render';
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
    const { container } = renderWithContext(
      <Component userId={12} store={store} />,
      { user: { 12: { balance: 0 } } }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('Connected CreateCustomTransactionForm', () => {
    describe('with deposit', () => {
      it('submits form with cents value', () => {
        const mock = jest.fn();
        const { getByPlaceholderText, getByText } = renderWithContext(
          <CreateCustomTransactionForm
            boundary={{ upper: 100, lower: -50 }}
            createTransaction={mock}
            userId={12}
          />,
          {
            user: { 12: { balance: 0 } },
          }
        );
        const input = getByPlaceholderText('CUSTOM AMOUNT');
        const button = getByText('+');

        fireEvent.change(input, { target: { value: '1200' } });
        fireEvent.submit(button);

        // expect(mock).toHaveBeenCalledWith(12, { amount: 1200 });
      });
    });
  });
  describe('with dispense', () => {
    it('submits form with negated cents value', async () => {
      const mock = jest.fn();
      const mockOnCreate = jest.fn();

      const { getByPlaceholderText, getByText } = renderWithContext(
        <CreateCustomTransactionForm
          boundary={{ upper: 100, lower: -50 }}
          transactionCreated={mockOnCreate}
          createTransaction={mock}
          userId={1}
        />,
        { user: { 1: { balance: 0 } } }
      );
      const input = getByPlaceholderText('CUSTOM AMOUNT');
      const button = getByText('-');

      fireEvent.change(input, { target: { value: '120' } });
      fireEvent.submit(button);

      // expect(mock).toHaveBeenCalledWith(1, { amount: -120 });
      // await wait(() => expect(mockOnCreate).toHaveBeenCalled());
    });
  });
});
