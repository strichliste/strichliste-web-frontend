import { useQuery } from '@tanstack/react-query';

import { get } from '../../services/api';
import { queryKeys } from '../../queries/keys';

const checkNaN = (value: number): number => {
  const maybeNaN = value / 100;
  return isNaN(maybeNaN) ? 0 : maybeNaN;
};

function formatMetric(nextMetrics: Metric): FormattedMetric {
  return {
    ...nextMetrics,
    days: nextMetrics.days.map((day) => ({
      balance: checkNaN(day.balance),
      charged: checkNaN(day.charged.amount),
      date: day.date,
      distinctUsers: day.distinctUsers,
      spent: checkNaN(day.spent.amount),
      transactions: day.transactions,
    })),
  };
}

export const useMetrics = (): FormattedMetric | null => {
  const { data } = useQuery({
    queryKey: queryKeys.metrics,
    queryFn: async ({ signal }): Promise<FormattedMetric> => {
      const nextMetrics = await get<Metric>('metrics', { signal });
      return formatMetric(nextMetrics);
    },
  });

  return data ?? null;
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
