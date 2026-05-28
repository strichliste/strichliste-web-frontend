import { useMutation, useQuery } from '@tanstack/react-query';

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
    queryFn: async ({ signal }): Promise<UserTransactions> => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
      });
      const res = await get<TransactionsResult>(
        `user/${encodeURIComponent(userId)}/transaction?${params.toString()}`,
        { signal }
      );
      return { transactions: res.transactions ?? [], count: res.count ?? 0 };
    },
    enabled: Boolean(userId),
    meta: { defaultError: 'USER_TRANSACTIONS_LOADING_ERROR' },
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
  const data = await errorHandler({
    promise: post<TransactionResult>(
      `user/${encodeURIComponent(userId)}/transaction`,
      params
    ),
    defaultError: 'USER_TRANSACTION_CREATION_ERROR',
  });
  if (data?.transaction) {
    playCashSound(params);
    invalidateUserData(userId, params.recipientId);
    return data.transaction;
  }
  return undefined;
}

export async function deleteTransaction(
  userId: string,
  transactionId: number
): Promise<void> {
  const data = await errorHandler({
    promise: restDelete<TransactionResult>(
      `user/${encodeURIComponent(userId)}/transaction/${transactionId}`
    ),
    defaultError: 'USER_TRANSACTION_DELETION_ERROR',
  });
  if (data?.transaction) {
    invalidateUserData(userId);
  }
}

// --- Mutation hooks ------------------------------------------------------
// Wrap the imperative helpers so call sites get `isPending` for free
// (used to disable submit buttons and prevent double-submit).

export function useCreateTransaction() {
  return useMutation({
    mutationKey: ['createTransaction'],
    mutationFn: ({
      userId,
      params,
    }: {
      userId: string;
      params: CreateTransactionParams;
    }) => createTransaction(userId, params),
  });
}

export function useDeleteTransaction() {
  return useMutation({
    mutationKey: ['deleteTransaction'],
    mutationFn: ({
      userId,
      transactionId,
    }: {
      userId: string;
      transactionId: number;
    }) => deleteTransaction(userId, transactionId),
  });
}
