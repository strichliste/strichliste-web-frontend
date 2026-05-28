import { useQuery } from '@tanstack/react-query';

import { get } from '../services/api';
import { MaybeResponse } from '../services/error-handler';
import { defaultSettings, Paypal, Settings } from '../types/settings';
import { queryKeys } from './keys';

type SettingsResult = MaybeResponse & { settings: Settings };

/**
 * App-wide settings. `initialData` guarantees a fully-populated object so the
 * many synchronous `useSettings().x` reads never see `undefined`; on failure we
 * surface the global error toast and fall back to defaults (previous behaviour).
 */
export function useSettings(): Settings {
  const { data } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: async ({ signal }): Promise<Settings> => {
      const res = await get<SettingsResult>('settings', { signal });
      return res.settings;
    },
    initialData: defaultSettings,
    staleTime: 5 * 60 * 1000,
    meta: { defaultError: 'SETTINGS_LOADED_FAILED' },
  });
  return data;
}

export function usePayPalSettings(): Paypal {
  return useSettings().paypal;
}

export function useIsPaymentEnabled(): boolean {
  const payment = useSettings().payment;
  const active = (deposit: { enabled: boolean; custom: boolean }) =>
    Boolean(deposit.enabled || deposit.custom);
  return active(payment.deposit) || active(payment.dispense);
}
