/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithContext } from '../../../spec-configs/render';
import { useTransactionValidator } from '../validator';

afterEach(cleanup);

const defaultBoundary = {
  upper: 10,
  lower: -10,
};

const defaultPaymentBoundary = {
  upper: 5,
  lower: -5,
};

const renderTransactionValidator = ({
  accountBoundary = defaultBoundary,
  paymentBoundary = defaultPaymentBoundary,
  value = 10,
  balance = 0,
  isDeposit = true,
}: any) => {
  const Component = () => {
    const isValid = useTransactionValidator(value, '1', isDeposit);
    return <div data-testid="result">{isValid ? 'yes' : 'no'}</div>;
  };
  const { getByTestId } = renderWithContext(<Component />, {
    user: { '1': { balance } },
    settings: {
      account: { boundary: accountBoundary },
      payment: { boundary: paymentBoundary },
    },
  });

  return getByTestId;
};

describe('TransactionValidator', () => {
  describe('for deposit', () => {
    it('is valid in paymentBoundary and accountBoundary', () => {
      const getByTestId = renderTransactionValidator({ value: 4, balance: 0 });
      expect(getByTestId('result').textContent).toEqual('yes');
    });

    it('is valid in account but not for paymentBoundary', () => {
      const getByTestId = renderTransactionValidator({ value: 6, balance: 0 });
      expect(getByTestId('result').textContent).toEqual('no');
    });

    it('is valid for payment but not for accountBoundary', () => {
      const getByTestId = renderTransactionValidator({ value: 4, balance: 9 });
      expect(getByTestId('result').textContent).toEqual('no');
    });

    it('has upper account disabled', () => {
      const getByTestId = renderTransactionValidator({
        accountBoundary: { upper: false, lower: -5 },
        value: 4,
        balance: 9,
      });
      expect(getByTestId('result').textContent).toEqual('yes');
    });

    it('has upper payment disabled', () => {
      const getByTestId = renderTransactionValidator({
        paymentBoundary: { upper: false, lower: -5 },
        value: 9,
        balance: 0,
      });
      expect(getByTestId('result').textContent).toEqual('yes');
    });
  });

  describe('for dispense', () => {
    it('is valid in paymentBoundary and accountBoundary', () => {
      const getByTestId = renderTransactionValidator({
        isDeposit: false,
        value: 4,
        balance: 0,
      });
      expect(getByTestId('result').textContent).toEqual('yes');
    });

    it('is valid in account but not for paymentBoundary', () => {
      const getByTestId = renderTransactionValidator({
        isDeposit: false,
        value: 6,
        balance: 0,
      });
      expect(getByTestId('result').textContent).toEqual('no');
    });

    it('negative value is valid for payment but not for accountBoundary', () => {
      const getByTestId = renderTransactionValidator({
        isDeposit: false,
        value: 4,
        balance: -9,
      });
      expect(getByTestId('result').textContent).toEqual('no');
    });

    it('has lower account disabled', () => {
      const getByTestId = renderTransactionValidator({
        isDeposit: false,
        accountBoundary: { upper: 5, lower: false },
        value: 4,
        balance: -9,
      });
      expect(getByTestId('result').textContent).toEqual('yes');
    });

    it('has upper payment disabled', () => {
      const getByTestId = renderTransactionValidator({
        isDeposit: false,
        paymentBoundary: { upper: 5, lower: false },
        value: -9,
        balance: 0,
      });
      expect(getByTestId('result').textContent).toEqual('yes');
    });
  });
});
