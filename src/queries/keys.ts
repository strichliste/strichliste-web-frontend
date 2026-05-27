/**
 * Central query-key factory for all server resources. Keeping keys in one place
 * keeps cache reads and invalidations consistent across queries and mutations.
 */
export const queryKeys = {
  settings: ['settings'] as const,

  users: (isActive?: boolean) => ['users', { isActive }] as const,
  user: (id: string) => ['user', id] as const,

  userTransactions: (userId: string, page?: number) =>
    ['user', userId, 'transactions', { page }] as const,

  articles: (isActive?: boolean) => ['articles', { isActive }] as const,
  article: (id: number) => ['article', id] as const,

  metrics: ['metrics'] as const,
  userMetrics: (userId: string) => ['metrics', 'user', userId] as const,
};
