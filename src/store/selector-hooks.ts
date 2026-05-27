import { useAppSelector } from './hooks';
import { getGlobalError } from './reducers';

// Server state lives in TanStack Query; re-export the hooks so existing
// `../store` imports keep working unchanged.
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
export {
  useUsers,
  useUser,
  useUserName,
  useUserBalance,
  useUserArray,
  useFilteredUsers,
} from '../queries/users';
export { useUserTransactions } from '../queries/transactions';

// Global error banner is the only piece of server-ish UI state still in Redux.
export function useGlobalError() {
  return useAppSelector(getGlobalError);
}
