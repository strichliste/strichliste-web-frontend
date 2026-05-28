import { QueryCache, QueryClient } from '@tanstack/react-query';
import { setGlobalError } from './global-error';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { defaultError?: string };
  }
}

/**
 * Shared TanStack Query client. Server data (read paths) is migrated onto this
 * incrementally; it is the home for caching/refetch/loading of API resources.
 *
 * Read failures (network / non-2xx ApiError) bubble out of the queryFn so
 * TanStack Query records them (isError, retry policy). The QueryCache below
 * additionally surfaces the per-query `meta.defaultError` message id through
 * the global toast, so the UX is identical to the pre-migration thunk flow.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (_error, query) => {
      const message = query.meta?.defaultError;
      if (message) setGlobalError(message);
    },
  }),
});
