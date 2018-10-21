import { ThemeProvider, theme } from 'bricks-of-sand';
import { MemoryHistory, createMemoryHistory } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { RenderResult, render } from 'react-testing-library';
import { DeepPartial, Store, createStore } from 'redux';
import { AppState, reducer } from '../store';

export function renderWithContext(
  ui: JSX.Element,
  initialState: DeepPartial<AppState>,
  store: Store<AppState> = createStore(reducer, initialState),
  _route: string = '/',
  history: MemoryHistory = createMemoryHistory()
): RenderResult {
  return render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router history={history}>
          <IntlProvider>{ui}</IntlProvider>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export function renderAndReturnContext(
  ui: JSX.Element,
  initialState: DeepPartial<AppState>,
  store: Store<AppState> = createStore(reducer, initialState),
  _route: string = '/',
  history: MemoryHistory = createMemoryHistory()
): { result: RenderResult; store: Store<AppState>; history: MemoryHistory } {
  return {
    result: render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router history={history}>
            <IntlProvider textComponent={React.Fragment}>{ui}</IntlProvider>
          </Router>
        </Provider>
      </ThemeProvider>
    ),
    store,
    history,
  };
}

export function renderWithIntl(ui: JSX.Element): RenderResult {
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider textComponent={React.Fragment}>{ui}</IntlProvider>
    </ThemeProvider>
  );
}
