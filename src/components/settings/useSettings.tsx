import { useQuery } from 'react-query';
import { fetchJson } from '../../services/api';
import { MaybeResponse } from '../../services/error-handler';

export enum SettingsTypes {
  StartLoadingSettings = 'START_LOADING_SETTINGS',
  SettingsLoaded = 'SETTINGS_LOADED',
}

export interface SettingsResponse extends MaybeResponse {
  settings: Settings;
}

export interface Settings {
  i18n: I18N;
  article: Article;
  account: Account;
  payment: Payment;
  paypal: Paypal;
  user: User;
  common: {
    idleTimeout: number;
  };
}

export interface Payment {
  boundary: Boundary;
  transactions: Transactions;
  deposit: Deposit;
  dispense: Deposit;
}

export interface Boundary {
  upper: number | boolean;
  lower: number | boolean;
}

export interface Setting {
  settings: Settings;
}

export interface Settings {
  i18n: I18N;
  account: Account;
  payment: Payment;
}

export interface Account {
  boundary: Boundary;
}

interface Article {
  enabled: boolean;
  autoOpen: boolean;
}

// tslint:disable-next-line:interface-name
export interface I18N {
  dateFormat: string;
  timezone: string;
  language: string;
  currency: Currency;
}

export interface Currency {
  name: string;
  symbol: string;
  alpha3: string;
}

export interface Payment {
  undo: Undo;
  boundary: Boundary;
  transactions: Transactions;
  splitInvoice: Transactions;
  deposit: Deposit;
  dispense: Deposit;
}

export interface Deposit {
  enabled: boolean;
  custom: boolean;
  steps: number[];
}

export interface Transactions {
  enabled: boolean;
}

export interface Undo {
  enabled: boolean;
  delete: boolean;
  timeout: string;
}

export interface Paypal {
  enabled: boolean;
  recipient: string;
  fee: number;
  sandbox?: boolean;
}

interface User {
  stalePeriod: string;
}

export const defaultSettings: Settings = {
  article: {
    enabled: false,
    autoOpen: false,
  },
  common: { idleTimeout: 30000 },
  paypal: {
    enabled: true,
    recipient: 'finanzen@hackerspace-bamberg.de',
    fee: 0,
    sandbox: true,
  },
  user: { stalePeriod: '10 day' },
  i18n: {
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    timezone: 'auto',
    language: 'en',
    currency: { name: 'Euro', symbol: '\u20ac', alpha3: 'EUR' },
  },
  account: { boundary: { upper: 20000, lower: -20000 } },
  payment: {
    undo: { enabled: true, delete: true, timeout: '5 minute' },
    boundary: { upper: 15000, lower: -2000 },
    transactions: { enabled: true },
    splitInvoice: { enabled: true },
    deposit: {
      enabled: true,
      custom: true,
      steps: [50, 100, 200, 500, 1000],
    },
    dispense: {
      enabled: true,
      custom: true,
      steps: [50, 100, 200, 500, 1000],
    },
  },
};

const fetchSettings = () => {
  return fetchJson('settings');
};
export function useSettings() {
  const { data } = useQuery<SettingsResponse>('settings', fetchSettings, {
    staleTime: 1000000,
  });
  return data?.settings ?? defaultSettings;
}
