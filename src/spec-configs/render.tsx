/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemoryHistory, createMemoryHistory } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router';
import { render } from '@testing-library/react';
import { DeepPartial, Store, createStore } from 'redux';
import { StoreContext } from 'redux-react-hook';

import { AppState, reducer } from '../store';

export function renderWithContext(
  ui: JSX.Element,
  initialState: DeepPartial<AppState>,
  store = createStore<any, any, any, any>(reducer, initialState),
  history: MemoryHistory = createMemoryHistory()
) {
  return render(
    <StoreContext.Provider value={store}>
      <Router history={history}>
        <IntlProvider locale="en">{ui}</IntlProvider>
      </Router>
    </StoreContext.Provider>
  );
}

export function renderAndReturnContext(
  ui: JSX.Element,
  initialState: DeepPartial<AppState>,
  store: Store<AppState> = createStore<any, any, any, any>(
    reducer,
    initialState
  ),
  history: MemoryHistory = createMemoryHistory()
) {
  return {
    result: render(
      <StoreContext.Provider value={store}>
        <Router history={history}>
          <IntlProvider locale="en" textComponent={React.Fragment}>
            {ui}
          </IntlProvider>
        </Router>
      </StoreContext.Provider>
    ),
    store,
    history,
  };
}

export function renderWithIntl(ui: JSX.Element) {
  return render(
    <IntlProvider locale="en" textComponent={React.Fragment}>
      {ui}
    </IntlProvider>
  );
}
