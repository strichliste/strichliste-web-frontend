import { useCallback } from 'react';
import { AppState } from '.';
import {
  Article,
  User,
  getArticleById,
  getArticleList,
  getPopularArticles,
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

// Settings live in TanStack Query now; re-export so existing `../store` imports
// keep working.
export {
  useSettings,
  usePayPalSettings,
  useIsPaymentEnabled,
} from '../queries/settings';

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

export function useArticles(): Article[] {
  return useSelector<AppState, Article[]>(getArticleList);
}

export function useActiveArticles(isActive: boolean): Article[] {
  const articles = useArticles();

  return articles.filter((article) => article.isActive === isActive);
}

export function usePopularArticles(): Article[] {
  return useSelector<AppState, Article[]>(getPopularArticles);
}

export function useArticle(id: number | undefined) {
  return useSelector<AppState, Article | undefined>(
    useCallback((state: AppState) => getArticleById(state, id || 0), [id])
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
