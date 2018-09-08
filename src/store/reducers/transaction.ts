import { User, setGlobalError, setGlobalLoader } from '.';
import { get, post, restDelete } from '../../services/api';
import { playCashSound } from '../../services/sound';
import { Action, DefaultThunkAction } from '../action';
import { AppState, Dispatch, ThunkAction } from '../store';
import { Article } from './article';
import { userDetailsLoaded } from './user';

export interface Transaction {
  id: number;
  user: User;
  article?: Article;
  sender?: User;
  recipient?: User;
  comment?: string;
  amount: number;
  created: string;
  deleted: boolean;
  isDeletable: boolean;
}

export interface TransactionResponse {
  transactions: Transaction[];
}

export interface TransactionResponse {
  transaction: Transaction;
}

export enum TransactionTypes {
  StartLoadingTransactions = 'START_LOADING_TRANSACTIONS',
  TransactionsLoaded = 'TRANSACTIONS_LOADED',
}

export interface TransactionsLoadedAction {
  type: TransactionTypes.TransactionsLoaded;
  payload: Transaction[];
}

export function transactionsLoaded(
  payload: Transaction[]
): TransactionsLoadedAction {
  return {
    type: TransactionTypes.TransactionsLoaded,
    payload,
  };
}

export type TransactionActions = TransactionsLoadedAction;

export function startLoadingTransactions(
  userId: number,
  offset?: number,
  limit?: number
): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(setGlobalLoader(true));
    dispatch(setGlobalError(''));
    const params =
      offset !== undefined && limit !== undefined
        ? `?offset=${offset}&limit=${limit}`
        : '?offset=0&limit=15';
    try {
      const data: TransactionResponse = await get(
        `user/${userId}/transaction${params}`
      );
      dispatch(setGlobalLoader(false));
      if (data && data.transactions) {
        dispatch(transactionsLoaded(data.transactions));
      } else {
        dispatch(setGlobalError('USER_TRANSACTIONS_LOADING_ERROR'));
      }
    } catch (e) {
      dispatch(setGlobalLoader(false));
      dispatch(setGlobalError('USER_TRANSACTIONS_LOADING_ERROR'));
    }
  };
}

export interface CreateTransactionParams {
  amount: number;
  articleId?: number;
  recipientId?: number;
  comment?: string;
}
export function startCreatingTransaction(
  userId: number,
  params: CreateTransactionParams
  // tslint:disable-next-line:no-any
): ThunkAction<Promise<any>> {
  return async (dispatch: Dispatch) => {
    dispatch(setGlobalLoader(true));
    dispatch(setGlobalError(''));
    playCashSound(params);
    try {
      const data: TransactionResponse = await post(
        `user/${userId}/transaction`,
        params
      );
      dispatch(setGlobalLoader(false));

      if (data.transaction) {
        dispatch(userDetailsLoaded(data.transaction.user));
        dispatch(transactionsLoaded([data.transaction]));
        return data.transaction;
      } else {
        dispatch(setGlobalError('USER_TRANSACTION_CREATION_ERROR'));
        return undefined;
      }
    } catch (error) {
      dispatch(setGlobalLoader(false));
      dispatch(setGlobalError('USER_TRANSACTION_CREATION_ERROR'));
      return undefined;
    }
  };
}

export function startDeletingTransaction(
  userId: number,
  transactionId: number
): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(setGlobalLoader(true));
    dispatch(setGlobalError(''));

    try {
      const data: TransactionResponse = await restDelete(
        `user/${userId}/transaction/${transactionId}`
      );
      dispatch(setGlobalLoader(false));

      if (data.transaction) {
        dispatch(transactionsLoaded([data.transaction]));
        dispatch(userDetailsLoaded(data.transaction.user));
      } else {
        dispatch(setGlobalError('USER_TRANSACTION_DELETION_ERROR'));
      }
    } catch (error) {
      dispatch(setGlobalLoader(false));
      dispatch(setGlobalError('USER_TRANSACTION_DELETION_ERROR'));
    }
  };
}

interface TransactionState {
  [key: number]: Transaction;
}

export function transaction(
  state: TransactionState = {},
  action: Action
): TransactionState {
  switch (action.type) {
    case TransactionTypes.TransactionsLoaded:
      return action.payload.reduce((nextState, transaction) => {
        return { ...nextState, [transaction.id]: transaction };
      }, state);
    default:
      return state;
  }
}

export function getTransactionState(state: AppState): TransactionState {
  return state.transaction;
}

export function getTransaction(
  state: AppState,
  id: number
): Transaction | undefined {
  return getTransactionState(state)[id];
}

export function isTransactionDeletable(state: AppState, id: number): boolean {
  const transaction = getTransaction(state, id);
  if (transaction) {
    return transaction.isDeletable;
  }

  return false;
}
