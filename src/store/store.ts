import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { error, loader, search } from './reducers';

const rootReducer = combineReducers({
  error,
  loader,
  search,
});

export type AppState = ReturnType<typeof rootReducer>;

export const reducer = rootReducer;

export const store = configureStore({
  reducer: rootReducer,
  // The legacy hand-written reducers/actions predate RTK's conventions; disable
  // the dev-only checks rather than rewrite every action to be RTK-idiomatic.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

// Legacy thunks accept a plain dispatch. Kept intentionally loose to bridge the
// hand-written action creators (which lack RTK's index signatures) and the
// value returned by react-redux's `useDispatch`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dispatch = (action: any) => unknown;
