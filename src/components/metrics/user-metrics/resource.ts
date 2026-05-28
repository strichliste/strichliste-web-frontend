import { useQuery } from '@tanstack/react-query';

import { get } from '../../../services/api';
import { queryKeys } from '../../../queries/keys';
import { Article } from '../../../types';

export const useMetrics = (userId: string): UserMetric | null => {
  const { data } = useQuery({
    queryKey: queryKeys.userMetrics(userId),
    queryFn: ({ signal }): Promise<UserMetric> =>
      get<UserMetric>(`user/${encodeURIComponent(userId)}/metrics`, { signal }),
    enabled: Boolean(userId),
  });

  return data ?? null;
};

export interface ArticleEntry {
  article: Article;
  count: number;
  amount: number;
}

export interface Outgoing {
  count: number;
  amount: number;
}

export interface Incoming {
  count: number;
  amount: number;
}

export interface Transactions {
  count: number;
  outgoing: Outgoing;
  incoming: Incoming;
}

export interface UserMetric {
  balance: number;
  articles: ArticleMetric[];
  transactions: Transactions;
}
export interface ArticleMetric {
  article: Article;
  count: number;
  amount: number;
}
