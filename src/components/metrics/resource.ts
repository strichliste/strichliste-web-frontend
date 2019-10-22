import { useState } from 'react';

import { get, useEffectAsync } from '../../services/api';

const checkNaN = (value: number): number => {
  const maybeNaN = value / 100;
  return isNaN(maybeNaN) ? 0 : maybeNaN;
};

export const useMetrics = (): FormattedMetric | null => {
  const [metric, setMetrics] = useState<FormattedMetric | null>(null);

  useEffectAsync(async () => {
    const nextMetrics: Metric = await get(`metrics`);

    const formattedMetric = {
      ...nextMetrics,
      days: nextMetrics.days.map(day => ({
        balance: checkNaN(day.balance),
        charged: checkNaN(day.charged.amount),
        date: day.date,
        distinctUsers: day.distinctUsers,
        spent: checkNaN(day.spent.amount),
        transactions: day.transactions,
      })),
    };

    setMetrics(formattedMetric);
  }, []);

  return metric;
};

interface Metric {
  balance: number;
  transactionCount: number;
  userCount: number;
  articles: Article[];
  days: Day[];
}

interface FormattedMetric {
  balance: number;
  transactionCount: number;
  userCount: number;
  articles: Article[];
  days: FormattedDay[];
}

interface FormattedDay {
  date: string;
  transactions: number;
  distinctUsers: number;
  balance: number;
  charged: number;
  spent: number;
}

interface Day {
  date: string;
  transactions: number;
  distinctUsers: number;
  balance: number;
  charged: Charged;
  spent: Charged;
}

interface Charged {
  amount: number;
  transactions: number;
}

interface Article {
  id: number;
  name: string;
  barcode?: string;
  amount: number;
  isActive: boolean;
  usageCount: number;
  precursor?: any;
  created: string;
}
