import { useQuery } from '@tanstack/react-query';

import { get, post, restDelete } from '../services/api';
import { errorHandler, MaybeResponse } from '../services/error-handler';
import { queryClient } from '../services/query-client';
import { playCashSound } from '../services/sound';
import {
  CreateTransactionParams,
  Transaction,
} from '../types/transaction';
import { queryKeys } from './keys';

export type {
  Transaction,
  CreateTransactionParams,
} from '../types/transaction';

type TransactionsResult = MaybeResponse & {
  transactions: Transaction[];
  count?: number;
};
type TransactionResult = MaybeResponse & { transaction: Transaction };

export interface UserTransactions {
  transactions: Transaction[];
  count: number;
}

// --- Queries -------------------------------------------------------------

export function useUserTransactions(
  userId: string,
  offset = 0,
  limit = 5
): UserTransactions {
  const { data } = useQuery({
    queryKey: queryKeys.userTransactions(userId, offset, limit),
    queryFn: async (): Promise<UserTransactions> => {
      const data = await errorHandler<TransactionsResult>({
        promise: get(`user/${userId}/transaction?offset=${offset}&limit=${limit}`),
        defaultError: 'USER_TRANSACTIONS_LOADING_ERROR',
      });
      return { transactions: data?.transactions ?? [], count: data?.count ?? 0 };
    },
    enabled: Boolean(userId),
  });
  return data ?? { transactions: [], count: 0 };
}

// --- Mutations -----------------------------------------------------------

function invalidateUserData(userId: string, recipientId?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
  queryClient.invalidateQueries({
    queryKey: ['user', String(userId), 'transactions'],
  });
  queryClient.invalidateQueries({ queryKey: ['users'] });
  if (recipientId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.user(recipientId) });
  }
}

export async function createTransaction(
  userId: string,
  params: CreateTransactionParams
): Promise<Transaction | undefined> {
  playCashSound(params);
  const data = await errorHandler<TransactionResult>({
    promise: post(`user/${userId}/transaction`, params),
    defaultError: 'USER_TRANSACTION_CREATION_ERROR',
  });
  if (data?.transaction) {
    invalidateUserData(userId, params.recipientId);
    return data.transaction;
  }
  return undefined;
}

export async function deleteTransaction(
  userId: string,
  transactionId: number
): Promise<void> {
  const data = await errorHandler<TransactionResult>({
    promise: restDelete(`user/${userId}/transaction/${transactionId}`),
    defaultError: 'USER_TRANSACTION_DELETION_ERROR',
  });
  if (data?.transaction) {
    invalidateUserData(userId);
  }
}
