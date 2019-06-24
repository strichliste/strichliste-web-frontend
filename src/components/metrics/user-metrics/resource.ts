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

interface UserMetric {
  balance: number;
  articles: ArticleMetric[];
  transactions: Transactions;
}

interface Transactions {
  count: number;
  charged: Charged;
  spent: Charged;
}

interface Charged {
  amount: number;
  transactions: number;
}

export interface ArticleMetric {
  article: Article;
  count: number;
  amount: number;
}
