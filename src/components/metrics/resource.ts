import { useState } from 'react';

import { get, useEffectAsync } from '../../services/api';

export const useMetrics = (): Metric | null => {
  const [metric, setMetrics] = useState(null);

  useEffectAsync(async () => {
    const nextMetrics = await get(`metrics`);
    setMetrics(nextMetrics);
  }, []);

  return metric;
};

export interface Day {
  date: string;
  count: string;
  distinctUsers: string;
  balance: number;
  positiveBalance: number;
  negativeBalance: number;
}

export interface Metric {
  balance: number;
  transactionCount: number;
  userCount: number;
  days: Day[];
}
