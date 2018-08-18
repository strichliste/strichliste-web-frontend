import { get } from '../../services/api';
import { Action, DefaultThunkAction } from '../action';
import { Dispatch } from '../store';

export enum SettingsTypes {
  StartLoadingSettings = 'START_LOADING_SETTINGS',
  SettingsLoaded = 'SETTINGS_LOADED',
}

export interface SettingsResponse {
  settings: Settings;
}

// tslint:disable-next-line:interface-name
export interface I18n {
  dateFormat: string;
  timezone: string;
  language: string;
  currency: string;
}

export interface Transactions {
  enabled: boolean;
}

export interface Boundary {
  upper: number;
  lower: number;
}

export interface Deposit {
  enabled: boolean;
  custom: boolean;
  boundary: Boundary;
  steps: number[];
}

export interface Boundery {
  upper: number;
  lower: number;
}

export interface Dispense {
  enabled: boolean;
  custom: boolean;
  boundery: Boundery;
  steps: number[];
}

export interface Payment {
  transactions: Transactions;
  deposit: Deposit;
  dispense: Dispense;
}

export interface Settings {
  staleUserPeriod: string;
  i18n: I18n;
  payment: Payment;
}

export interface SettingsLoadedAction {
  type: SettingsTypes.SettingsLoaded;
  payload: Settings;
}

export type SettingsActions = SettingsLoadedAction;

export function settingsLoaded(settings: Settings): SettingsLoadedAction {
  return {
    type: SettingsTypes.SettingsLoaded,
    payload: settings,
  };
}

export function startLoadingSettings(): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    const data: SettingsResponse = await get('settings');
    if (data.settings) {
      dispatch(settingsLoaded(data.settings));
    }
  };
}

const initialState = {
  staleUserPeriod: '10 day',
  i18n: {
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    timezone: 'auto',
    language: 'en',
    currency: '\u20ac',
  },
  payment: {
    transactions: { enabled: true },
    deposit: {
      enabled: true,
      custom: true,
      boundary: { upper: 9999999, lower: -5000 },
      steps: [50, 100, 200, 500, 1000],
    },
    dispense: {
      enabled: true,
      custom: true,
      boundery: { upper: 15000, lower: -2000 },
      steps: [50, 100, 200, 500, 1000],
    },
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
