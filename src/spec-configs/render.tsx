/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemoryHistory, createMemoryHistory } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router';
import { render } from '@testing-library/react';
import { DeepPartial, Store, createStore } from 'redux';
import { Provider } from 'react-redux';

import { AppState, reducer } from '../store';

// Wrapper component - uses message IDs as fallback, no translation files needed
const TestWrapper: React.FC<{
  store: Store<AppState>;
  history: MemoryHistory;
  children: React.ReactNode;
}> = ({ store, history, children }) => (
  <Provider store={store}>
    <Router history={history}>
      <IntlProvider locale="en" defaultLocale="en" onError={() => {}}>
        {children}
      </IntlProvider>
    </Router>
  </Provider>
);

export function renderWithContext(
  ui: React.ReactElement,
  initialState: DeepPartial<AppState> = {},
  store: Store<AppState> = createStore<any, any, any, any>(reducer, initialState),
  history: MemoryHistory = createMemoryHistory()
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper store={store} history={history}>
        {children}
      </TestWrapper>
    ),
  });
}

export function renderAndReturnContext(
  ui: React.ReactElement,
  initialState: DeepPartial<AppState> = {},
  store: Store<AppState> = createStore<any, any, any, any>(reducer, initialState),
  history: MemoryHistory = createMemoryHistory()
) {
  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestWrapper store={store} history={history}>
          {children}
        </TestWrapper>
      ),
    }),
    store,
    history,
  };
}

export function renderWithIntl(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => (
      <IntlProvider locale="en" defaultLocale="en" onError={() => {}}>
        {children}
      </IntlProvider>
    ),
  });
}
