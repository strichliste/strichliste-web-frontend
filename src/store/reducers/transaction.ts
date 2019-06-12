import { User } from '.';
import { get, post, restDelete } from '../../services/api';
import { MaybeResponse, errorHandler } from '../../services/error-handler';
import { playCashSound } from '../../services/sound';
import { Action } from '../action';
import { AppState, Dispatch } from '../store';
import { Article } from './article';
import { userDetailsLoaded } from './user';
import { getPayment } from './setting';

export interface Transaction {
  id: number;
  user: User;
  article?: Article;
  sender?: User;
  recipient?: User;
  comment?: string;
  amount: number;
  created: string;
  isDeleted: boolean;
  isDeletable: boolean;
}

export interface TransactionsResponse extends MaybeResponse {
  count?: number;
  transactions: Transaction[];
}

export interface TransactionResponse extends MaybeResponse {
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

export async function startLoadingTransactions(
  dispatch: Dispatch,
  userId: string,
  offset?: number,
  limit?: number
): Promise<TransactionsResponse | undefined> {
  const params =
    offset !== undefined && limit !== undefined
      ? `?offset=${offset}&limit=${limit}`
      : '?offset=0&limit=5';
  const promise = get(`user/${userId}/transaction${params}`);
  const data = await errorHandler<TransactionsResponse>(dispatch, {
    promise,
    defaultError: 'USER_TRANSACTIONS_LOADING_ERROR',
  });
  if (data && data.transactions) {
    dispatch(transactionsLoaded(data.transactions));
    return data;
  }
  return undefined;
}

export interface CreateTransactionParams {
  amount?: number;
  articleId?: number;
  recipientId?: string;
  comment?: string;
}
export async function startCreatingTransaction(
  dispatch: Dispatch,
  userId: string,
  params: CreateTransactionParams
): Promise<Transaction | undefined> {
  playCashSound(params);
  const promise = post(`user/${userId}/transaction`, params);
  const data = await errorHandler<TransactionResponse>(dispatch, {
    promise,
    defaultError: 'USER_TRANSACTION_CREATION_ERROR',
  });
  if (data && data.transaction) {
    dispatch(userDetailsLoaded(data.transaction.user));
    dispatch(transactionsLoaded([data.transaction]));
    return data.transaction;
  }
  return undefined;
}
export type StartCreatingTransaction = typeof startCreatingTransaction;

export async function startDeletingTransaction(
  dispatch: Dispatch,
  userId: string,
  transactionId: number
): Promise<void> {
  const promise = restDelete(`user/${userId}/transaction/${transactionId}`);
  const data = await errorHandler<TransactionResponse>(dispatch, {
    promise,
    defaultError: 'USER_TRANSACTION_DELETION_ERROR',
  });
  if (data && data.transaction) {
    dispatch(userDetailsLoaded(data.transaction.user));
    dispatch(transactionsLoaded([data.transaction]));
  }
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
  const payment = getPayment(state);
  if (!payment.undo.enabled) {
    return false;
  }

  const transaction = getTransaction(state, id);
  if (transaction) {
    return transaction.isDeletable;
  }

  return false;
}
