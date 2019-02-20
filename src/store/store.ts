import { combineReducers, createStore } from 'redux';

import { Action } from './';
import {
  article,
  error,
  loader,
  search,
  settings,
  transaction,
  user,
} from './reducers';

const reducers = {
  article,
  error,
  loader,
  user,
  transaction,
  settings,
  search,
};

export type AppState = {
  [K in keyof typeof reducers]: ReturnType<typeof reducers[K]>
};

export const reducer = combineReducers<AppState>(reducers);

export const store = createStore<AppState, Action, { dispatch: Dispatch }, {}>(
  reducer
);

export interface Dispatch {
  (action: Action): Action;
}
