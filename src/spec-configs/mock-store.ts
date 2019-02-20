import { Omit, merge } from 'lodash';
import { DeepPartial } from 'redux';
import createMockStore, {
  MockStore as OriginalMockStore,
} from 'redux-mock-store';

import { Action, AppState, Dispatch, reducer } from '../store';

export type PartialAppState = DeepPartial<AppState>;
export type MockStore = Omit<OriginalMockStore<PartialAppState>, 'dispatch'> & {
  dispatch: Dispatch;
};

export const getMockStore = (...states: PartialAppState[]): MockStore => {
  const action = {};
  const initialState = reducer(undefined, action as Action);
  return createMockStore([])(merge(initialState, ...states));
};

export interface MockStoreProps {
  store?: MockStore;
}

export function createConnectedComponent<Props>(
  component: React.ComponentType<Props>
): React.ComponentType<Props & MockStoreProps> {
  return component;
}
