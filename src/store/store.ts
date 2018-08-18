import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk, { ThunkAction as ReduxThunkAction } from 'redux-thunk';

import { Action } from './';
import { settings, transaction, user } from './reducers';

const reducers = {
  user,
  transaction,
  settings,
};

export type AppState = {
  [K in keyof typeof reducers]: ReturnType<typeof reducers[K]>
};

export const reducer = combineReducers<AppState>(reducers);
const composeEnhancers =
  // tslint:disable-next-line:no-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<
  AppState,
  Action,
  { dispatch: Dispatch },
  object
>(reducer, composeEnhancers(applyMiddleware(thunk)));

export type ThunkAction<Result, Parameter = undefined> = ReduxThunkAction<
  Result,
  AppState,
  Parameter,
  Action
>;

export interface Dispatch {
  <Result>(action: ThunkAction<Result>): Result;
  (action: Action): Action;
}
