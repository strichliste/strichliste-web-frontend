import { useCallback } from 'react';
import { AppState } from '.';
import {
  Article,
  User,
  getArticleById,
  getArticleList,
  getPayPal,
  getPopularArticles,
  getSettings,
  getUser,
  getUserArray,
  getUserBalance,
  getUserState,
  getFilteredUserIds,
  getGlobalError,
  isTransactionDeletable,
  isPaymentEnabled,
  Transaction,
} from './reducers';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { fetchJson } from '../services/api';

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

export function usePayPalSettings() {
  return useSelector(getPayPal);
}

const defaultSettings = {
  article: {
    enabled: false,
    autoOpen: false,
  },
  common: { idleTimeout: 30000 },
  paypal: {
    enabled: true,
    recipient: 'finanzen@hackerspace-bamberg.de',
    fee: 0,
    sandbox: true,
  },
  user: { stalePeriod: '10 day' },
  i18n: {
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    timezone: 'auto',
    language: 'en',
    currency: { name: 'Euro', symbol: '\u20ac', alpha3: 'EUR' },
  },
  account: { boundary: { upper: 20000, lower: -20000 } },
  payment: {
    undo: { enabled: true, delete: true, timeout: '5 minute' },
    boundary: { upper: 15000, lower: -2000 },
    transactions: { enabled: true },
    splitInvoice: { enabled: true },
    deposit: {
      enabled: true,
      custom: true,
      steps: [50, 100, 200, 500, 1000],
    },
    dispense: {
      enabled: true,
      custom: true,
      steps: [50, 100, 200, 500, 1000],
    },
  },
};
export function useSettings() {
  const { data, error, isLoading } = useQuery('settings', () =>
    fetchJson('settings')
  );
  return data ?? defaultSettings;
}

export function useIsPaymentEnabled() {
  return useSelector(isPaymentEnabled);
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

export function useIsTransactionDeletable(id: number) {
  return useSelector<AppState, boolean>(
    useCallback((state: AppState) => isTransactionDeletable(state, id), [id])
  );
}

export function useTransaction(id: number) {
  return useSelector<AppState, Transaction | undefined>(
    useCallback((state: AppState) => state.transaction[id], [id])
  );
}
