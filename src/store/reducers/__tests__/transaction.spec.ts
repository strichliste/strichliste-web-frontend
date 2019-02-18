// tslint:disable no-any

import { DeepPartial } from 'redux';
import { TransactionTypes, startCreatingTransaction, transaction } from '..';
import { Action } from '../..';
import { get, post, restDelete } from '../../../services/api';
import { getMockStore } from '../../../spec-configs/mock-store';
import {
  getTransaction,
  isTransactionDeletable,
  startDeletingTransaction,
  startLoadingTransactions,
} from '../transaction';

jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  restDelete: jest.fn(),
}));
jest.mock('../../../services/sound', () => ({ playCashSound: jest.fn() }));

describe('transaction reducer', () => {
  let action: DeepPartial<Action>;

  describe('with non matching action', () => {
    it('returns initial state', () => {
      const initialState = {};
      expect(transaction(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('with a transactionsLoaded action', () => {
    beforeEach(() => {
      action = {
        type: TransactionTypes.TransactionsLoaded,
        payload: [{ id: 2 }, { id: 3 }],
      };
    });

    it('merges transaction to state', () => {
      const result = transaction(undefined, action as Action);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('action creators', () => {
  describe('startCreatingTransaction', () => {
    beforeEach(() => {
      (post as any).mockImplementationOnce(() =>
        Promise.resolve({ transaction: { id: 5, user: { name: 'user' } } })
      );
    });

    it('pushes the transaction and dispatches the new transaction and updated user', async () => {
      const store = getMockStore();
      await store.dispatch(startCreatingTransaction(2, { amount: 1 }));

      expect(post).toHaveBeenCalledWith('user/2/transaction', { amount: 1 });
      expect(store.getActions()).toMatchSnapshot();
    });
  });
  describe('startDeletingTransaction', () => {
    beforeEach(() => {
      (restDelete as any).mockImplementationOnce(() =>
        Promise.resolve({ transaction: { id: 5, user: { name: 'user' } } })
      );
    });

    it('updates the transaction and dispatches the new transaction and updated user', async () => {
      const store = getMockStore();
      await store.dispatch(startDeletingTransaction(2, 4));

      expect(restDelete).toHaveBeenCalledWith('user/2/transaction/4');
      expect(store.getActions()).toMatchSnapshot();
    });
  });
  describe('startLoadingTransactions', () => {
    beforeEach(() => {
      (get as any).mockImplementationOnce(() =>
        Promise.resolve({ transactions: [{ id: 2 }, { id: 3 }] })
      );
    });

    it('pushes the transaction and dispatches the new transaction and updated user', async () => {
      const store = getMockStore();
      await startLoadingTransactions(store.dispatch, 2);

      expect(get).toHaveBeenCalledWith('user/2/transaction?offset=0&limit=5');
      expect(store.getActions()).toMatchSnapshot();
    });

    it('sets the given params', async () => {
      const store = getMockStore();
      await startLoadingTransactions(store.dispatch, 2, 50, 12);

      expect(get).toHaveBeenCalledWith('user/2/transaction?offset=50&limit=12');
    });
  });
});

describe('selectors', () => {
  describe('getTransaction', () => {
    it('returns undefined if no transaction is found', () => {
      expect(
        getTransaction(
          {
            transaction: { 1: { id: 1 } },
          } as any,
          5
        )
      ).toBeUndefined();
    });
    it('returns a matching transaction by id', () => {
      expect(
        getTransaction(
          {
            transaction: { 1: { id: 1 } },
          } as any,
          1
        )
      ).toEqual({ id: 1 });
    });
  });

  describe('isTransactionDeletable', () => {
    it('returns flag if transaction is found', () => {
      expect(
        isTransactionDeletable(
          { transaction: { 1: { id: 1, isDeletable: true } } } as any,
          1
        )
      ).toBeTruthy();
    });
    it('returns false if no transaction is found', () => {
      expect(
        isTransactionDeletable(
          { transaction: { 1: { id: 1, isDeletable: true } } } as any,
          2
        )
      ).toBeFalsy();
    });
  });
});
