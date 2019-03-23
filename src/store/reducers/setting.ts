import { get } from '../../services/api';
import { MaybeResponse, errorHandler } from '../../services/error-handler';
import { Action } from '../action';
import { AppState, Dispatch } from '../store';

export enum SettingsTypes {
  StartLoadingSettings = 'START_LOADING_SETTINGS',
  SettingsLoaded = 'SETTINGS_LOADED',
}

export interface SettingsResponse extends MaybeResponse {
  settings: Settings;
}

export interface Settings {
  i18n: I18N;
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

export interface SettingsLoadedAction {
  type: SettingsTypes.SettingsLoaded;
  payload: Settings;
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
  sandbox: boolean;
}

interface User {
  stalePeriod: string;
}

export type SettingsActions = SettingsLoadedAction;

export function settingsLoaded(settings: Settings): SettingsLoadedAction {
  return {
    type: SettingsTypes.SettingsLoaded,
    payload: settings,
  };
}

export async function startLoadingSettings(dispatch: Dispatch): Promise<void> {
  const promise = get('settings');
  const data = await errorHandler<SettingsResponse>(dispatch, {
    promise,
    defaultError: 'SETTINGS_LOADED_FAILED',
  });

  if (data && data.settings) {
    dispatch(settingsLoaded(data.settings));
  }
}

export const initialState = {
  common: { idleTimeout: 150000 },
  paypal: {
    enabled: false,
    recipient: '',
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
    undo: { enabled: true, delete: false, timeout: '5 minute' },
    boundary: { upper: 15000, lower: -2000 },
    transactions: { enabled: true },
    deposit: { enabled: true, custom: true, steps: [50, 100, 200, 500, 1000] },
    dispense: { enabled: true, custom: true, steps: [50, 100, 200, 500, 1000] },
  },
};

export function settings(
  state: Settings = initialState,
  action: Action
): Settings {
  switch (action.type) {
    case SettingsTypes.SettingsLoaded:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Settings selectors
export function getSettings(state: AppState): Settings {
  return state.settings;
}

export function getPayment(state: AppState): Payment {
  return getSettings(state).payment;
}

export function getSettingsBalance(state: AppState): number | boolean {
  return getSettings(state).payment.boundary.upper;
}

export function getPayPal(state: AppState): Paypal {
  return getSettings(state).paypal;
}
