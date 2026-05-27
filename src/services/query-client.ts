import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client. Server data (read paths) is migrated onto this
 * incrementally; it is the home for caching/refetch/loading of API resources.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The demo/kiosk backend changes from other clients; keep data reasonably
      // fresh but avoid hammering it.
      staleTime: 15_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
