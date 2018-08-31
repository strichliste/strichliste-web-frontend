// tslint:disable no-any

jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import { DeepPartial } from 'redux';
import {
  TransactionTypes,
  startCreatingTransaction,
  transaction,
  userDetailsLoaded,
} from '..';
import { Action } from '../..';
import { get, post } from '../../../services/api';
import { getMockStore } from '../../../spec-configs/mock-store';
import { startLoadingTransactions, transactionsLoaded } from '../transaction';

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
      const expectedResult = {
        2: { id: 2 },
        3: { id: 3 },
      };
      const result = transaction(undefined, action as Action);
      expect(result).toEqual(expectedResult);
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
      expect(store.getActions()).toEqual([
        userDetailsLoaded({ name: 'user' } as any),
        transactionsLoaded([{ id: 5, user: { name: 'user' } }] as any),
      ]);
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
      await store.dispatch(startLoadingTransactions(2));

      expect(get).toHaveBeenCalledWith('user/2/transaction?offset=0&limit=15');
      expect(store.getActions()).toEqual([
        transactionsLoaded([{ id: 2 }, { id: 3 }] as any),
      ]);
    });

    it('sets the given params', async () => {
      const store = getMockStore();
      await store.dispatch(startLoadingTransactions(2, 50, 12));

      expect(get).toHaveBeenCalledWith('user/2/transaction?offset=50&limit=12');
    });
  });
});
