import {
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import { ApiError } from './api';
import { setGlobalError } from './global-error';
import { ErrorClassMap, pickErrorMessage } from './error-handler';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { defaultError?: string };
    mutationMeta: { defaultError?: string; errors?: ErrorClassMap };
  }
}

/**
 * Shared TanStack Query client. Server data (reads + writes) flows through it;
 * it is the home for caching/refetch/loading of API resources and the central
 * place where failures get surfaced to the user.
 *
 * Read failures (network / non-2xx ApiError) bubble out of the queryFn so
 * TanStack records them (`isError`, retry policy). `queryCache.onError`
 * additionally surfaces the per-query `meta.defaultError` message id through
 * the global toast.
 *
 * Write failures bubble out of mutationFn as `ApiError` (HTTP or body-level
 * error). `mutationCache.onError` looks at `meta.errors` for a per-class
 * mapping, falling back to `meta.defaultError`. Consumers can therefore use
 * `useMutation`'s native `isError`/`onError`/`mutateAsync().catch(…)` —
 * `mutate()` is fire-and-forget, `mutateAsync()` rejects on failure.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      // One retry on network blips is reasonable for a kiosk on a LAN; don't
      // retry application-level rejections (ApiError with errorClass) — those
      // are deterministic.
      retry: (failureCount, error) =>
        failureCount < 1 &&
        error instanceof ApiError &&
        error.status !== 200 &&
        error.status >= 500,
    },
  },
  queryCache: new QueryCache({
    onError: (_error, query) => {
      const message = query.meta?.defaultError;
      if (message) setGlobalError(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      const meta = mutation.options.meta;
      if (!meta) return;
      const errorClass =
        error instanceof ApiError ? error.errorClass : undefined;
      const message = pickErrorMessage(errorClass, meta.errors, meta.defaultError);
      if (message) setGlobalError(message);
    },
  }),
});
