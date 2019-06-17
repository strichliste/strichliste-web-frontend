import { useState } from 'react';

import { get, useEffectAsync } from '../../services/api';

export const useMetrics = (): Metric | null => {
  const [metric, setMetrics] = useState<Metric | null>(null);

  useEffectAsync(async () => {
    const nextMetrics: Metric = await get(`metrics`);

    const formattedMetric = {
      ...nextMetrics,
      days: nextMetrics.days.map(day => ({
        balance: day.balance / 100,
        charged: day.charged / 100,
        date: day.date,
        distinctUsers: day.distinctUsers,
        spent: day.spent / 100,
        transactions: day.transactions,
      })),
    };

    setMetrics(formattedMetric);
  }, []);

  return metric;
};

export interface Day {
  balance: number;
  charged: number;
  date: string;
  distinctUsers: number;
  spent: number;
  transactions: number;
}

export interface Metric {
  balance: number;
  transactionCount: number;
  userCount: number;
  days: Day[];
}
