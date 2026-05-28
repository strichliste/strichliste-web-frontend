/**
 * Central query-key factory for all server resources. Keeping keys in one place
 * keeps cache reads and invalidations consistent across queries and mutations.
 */
export const queryKeys = {
  settings: ['settings'] as const,

  users: (isActive?: boolean) => ['users', { isActive }] as const,
  // The API returns numeric ids while route params are strings; coerce so the
  // same logical user maps to one cache key regardless of the caller.
  user: (id: string | number) => ['user', String(id)] as const,

  userTransactions: (
    userId: string | number,
    offset: number,
    limit: number
  ) => ['user', String(userId), 'transactions', { offset, limit }] as const,

  articles: (isActive?: boolean) => ['articles', { isActive }] as const,
  article: (id: number) => ['article', id] as const,
  tags: ['tags'] as const,

  metrics: ['metrics'] as const,
  userMetrics: (userId: string | number) =>
    ['metrics', 'user', String(userId)] as const,
};
