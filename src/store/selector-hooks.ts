import { useCallback } from 'react';
import { AppState } from '.';
import {
  User,
  getUser,
  getUserArray,
  getUserBalance,
  getUserState,
  getFilteredUserIds,
  getGlobalError,
  Transaction,
} from './reducers';
import { useSelector } from 'react-redux';
import { useSettings } from '../queries/settings';

// Settings and articles live in TanStack Query now; re-export so existing
// `../store` imports keep working.
export {
  useSettings,
  usePayPalSettings,
  useIsPaymentEnabled,
} from '../queries/settings';
export {
  useArticles,
  useActiveArticles,
  usePopularArticles,
  useArticle,
} from '../queries/articles';

export function useFilteredUsers(isActive: boolean) {
  return useSelector<AppState, string[]>(
    useCallback((state) => getFilteredUserIds(state, isActive), [isActive])
  );
}

export function useUser(id: string) {
  return useSelector<AppState, User | undefined>(
    useCallback((state) => getUser(state, id), [id])
  );
}

export function useUserName(id: string): string {
  const user = useSelector<AppState, User | undefined>(
    useCallback((state) => getUser(state, id), [id])
  );
  return user ? user.name : '';
}

export function useUserBalance(id: string): number {
  return useSelector<AppState, number>(
    useCallback((state) => getUserBalance(state, id), [id])
  );
}

export function useUserArray() {
  return useSelector(getUserArray);
}

export function useUserState() {
  return useSelector(getUserState);
}

export function useGlobalError() {
  return useSelector(getGlobalError);
}

export function useTransaction(id: number) {
  return useSelector<AppState, Transaction | undefined>(
    useCallback((state: AppState) => state.transaction[id], [id])
  );
}

export function useIsTransactionDeletable(id: number): boolean {
  const undoEnabled = useSettings().payment.undo.enabled;
  const transaction = useTransaction(id);
  return Boolean(undoEnabled && transaction && transaction.isDeletable);
}
