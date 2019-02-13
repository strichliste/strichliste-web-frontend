import { useEffect, useState } from 'react';

import { get } from '../../services/api';
import { Article } from '../../store/reducers';

// tslint:disable-next-line: no-any
function useEffectAsync(effect: any, inputs: any): void {
  useEffect(() => {
    effect();
  }, inputs);
}

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

export interface UserMetric {
  balance: number;
  articles: ArticleElement[];
  transactions: Transactions;
}

export interface ArticleElement {
  article: Article;
  count: number;
  amount: number;
}

export interface Transactions {
  count: number;
  outgoing: Ing;
  incoming: Ing;
}

export interface Ing {
  count: number;
  amount: number;
}
