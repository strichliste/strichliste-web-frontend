/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../../services/api', () => ({
  get: jest.fn(),
}));

import { DeepPartial } from 'redux';
import {
  Settings,
  getPayment,
  getSettings,
  initialState,
  settings,
  settingsLoaded,
} from '..';
import { Action } from '../..';
import { get } from '../../../services/api';
import { getMockStore } from '../../../spec-configs/mock-store';
import { AppState } from '../../store';
import { startLoadingSettings } from '../setting';

describe('settings reducer', () => {
  let action: DeepPartial<Action>;

  describe('with non matching action', () => {
    it('returns initial state', () => {
      expect(settings(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('with a settingsLoaded action', () => {
    const setting = { ...initialState, idleTimeout: 500 };
    beforeEach(() => {
      action = settingsLoaded(setting as Settings);
    });

    it('sets the setting to state', () => {
      const result = settings(undefined, action as Action);
      expect(result).toEqual(setting);
    });
  });
});

describe('action creators', () => {
  describe('startLoadingSettings', async () => {
    (get as any).mockImplementationOnce(() =>
      Promise.resolve({ settings: initialState })
    );

    const mockStore = getMockStore();
    await mockStore.dispatch(startLoadingSettings());
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

describe('selectors', () => {
  it('getSettings returns settings from state', () => {
    const state = {
      settings: initialState,
    };
    expect(getSettings(state as AppState)).toEqual(initialState);
  });

  it('getPayment returns payment from state', () => {
    const state = {
      settings: initialState,
    };
    const payment = initialState.payment;
    expect(getPayment(state as AppState)).toEqual(payment);
  });
});
