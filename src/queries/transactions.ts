import { useMutation, useQuery } from '@tanstack/react-query';

import { get, post, restDelete } from '../services/api';
import { MaybeResponse, throwOnBodyError } from '../services/error-handler';
import { setGlobalStatus } from '../services/global-status';
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

async function createTransaction(
  userId: string,
  params: CreateTransactionParams
): Promise<Transaction> {
  const res = throwOnBodyError(
    await post<TransactionResult>(
      `user/${encodeURIComponent(userId)}/transaction`,
      params
    )
  );
  playCashSound(params);
  // Hearing the sound only helps hearing users; the polite status region is
  // the AT signal that the deposit/dispense actually went through.
  setGlobalStatus('TRANSACTION_SUCCESS');
  invalidateUserData(userId, params.recipientId);
  return res.transaction;
}

async function deleteTransaction(
  userId: string,
  transactionId: number
): Promise<void> {
  throwOnBodyError(
    await restDelete<TransactionResult>(
      `user/${encodeURIComponent(userId)}/transaction/${transactionId}`
    )
  );
  invalidateUserData(userId);
}

// --- Mutation hooks ------------------------------------------------------
// Wrap the imperative helpers so call sites get `isPending` for free
// (used to disable submit buttons and prevent double-submit) and route
// failures through `mutationCache.onError` with the right localized message.

export function useCreateTransaction() {
  return useMutation({
    mutationFn: ({
      userId,
      params,
    }: {
      userId: string;
      params: CreateTransactionParams;
    }) => createTransaction(userId, params),
    meta: { defaultError: 'USER_TRANSACTION_CREATION_ERROR' },
  });
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: ({
      userId,
      transactionId,
    }: {
      userId: string;
      transactionId: number;
    }) => deleteTransaction(userId, transactionId),
    meta: { defaultError: 'USER_TRANSACTION_DELETION_ERROR' },
  });
}
