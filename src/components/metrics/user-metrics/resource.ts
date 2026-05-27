import { useQuery } from '@tanstack/react-query';

import { get } from '../../../services/api';
import { Article } from '../../../store/reducers';

export const useMetrics = (userId: string): UserMetric | null => {
  const { data } = useQuery({
    queryKey: ['metrics', 'user', userId],
    queryFn: (): Promise<UserMetric> => get(`user/${userId}/metrics`),
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
