import { useState } from 'react';

import { get, useEffectAsync } from '../../../services/api';
import { Article } from '../../../store/reducers';

export const useMetrics = (userId: string): UserMetric | null => {
  const [metrics, setMetrics] = useState(null);

  useEffectAsync(async () => {
    if (userId) {
      const nextMetrics = await get(`user/${userId}/metrics`);
      setMetrics(nextMetrics);
    }
  }, [userId]);

  return metrics;
};

export interface Article {
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
