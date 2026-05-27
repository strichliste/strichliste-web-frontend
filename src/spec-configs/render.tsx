/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Store, createStore } from 'redux';
import { DeepPartial } from '../types';
import { Provider } from 'react-redux';

import { AppState, reducer } from '../store';

export function renderWithContext(
  ui: React.ReactElement,
  initialState: DeepPartial<AppState>,
  store = createStore<any, any, any, any>(reducer, initialState),
  initialEntries: string[] = ['/']
) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <IntlProvider locale="en">{ui}</IntlProvider>
      </MemoryRouter>
    </Provider>
  );
}

export function renderAndReturnContext(
  ui: React.ReactElement,
  initialState: DeepPartial<AppState>,
  store: Store<AppState> = createStore<any, any, any, any>(
    reducer,
    initialState
  ),
  initialEntries: string[] = ['/']
) {
  return {
    result: render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <IntlProvider locale="en" textComponent={React.Fragment}>
            {ui}
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
}

export function renderWithIntl(ui: React.ReactElement) {
  return render(
    <IntlProvider locale="en" textComponent={React.Fragment}>
      {ui}
    </IntlProvider>
  );
}
