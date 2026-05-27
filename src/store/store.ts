import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { error, loader, search } from './reducers';

const rootReducer = combineReducers({
  error,
  loader,
  search,
});

export type AppState = ReturnType<typeof rootReducer>;

export const reducer = rootReducer;

// Client/UI state only (error, loader, search). Server state lives in TanStack
// Query (src/queries/*). All reducers are RTK slices with serializable actions.
export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type Dispatch = AppDispatch;
