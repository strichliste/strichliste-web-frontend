import { ThemeProvider, theme } from 'bricks-of-sand';
import { MemoryHistory, createMemoryHistory } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router';
import { render } from '@testing-library/react';
import { DeepPartial, Store, createStore } from 'redux';
import { StoreContext } from 'redux-react-hook';

import { AppState, reducer } from '../store';

const themeConfig = { light: theme, dark: theme };

export function renderWithContext(
  ui: JSX.Element,
  initialState: DeepPartial<AppState>,
  store: Store<AppState> = createStore(reducer, initialState),
  history: MemoryHistory = createMemoryHistory()
) {
  return render(
    <ThemeProvider themes={themeConfig}>
      <StoreContext.Provider value={store}>
        <Router history={history}>
          <IntlProvider>{ui}</IntlProvider>
        </Router>
      </StoreContext.Provider>
    </ThemeProvider>
  );
}

export function renderAndReturnContext(
  ui: JSX.Element,
  initialState: DeepPartial<AppState>,
  store: Store<AppState> = createStore(reducer, initialState),
  history: MemoryHistory = createMemoryHistory()
) {
  return {
    result: render(
      <ThemeProvider themes={themeConfig}>
        <StoreContext.Provider value={store}>
          <Router history={history}>
            <IntlProvider textComponent={React.Fragment}>{ui}</IntlProvider>
          </Router>
        </StoreContext.Provider>
      </ThemeProvider>
    ),
    store,
    history,
  };
}

export function renderWithIntl(ui: JSX.Element) {
  return render(
    <ThemeProvider themes={themeConfig}>
      <IntlProvider textComponent={React.Fragment}>{ui}</IntlProvider>
    </ThemeProvider>
  );
}
