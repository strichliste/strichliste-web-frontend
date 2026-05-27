/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { merge } from 'lodash';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { AppState, reducer } from '../store';
import { DeepPartial } from '../types';
import { defaultSettings, Settings } from '../store/reducers/setting';
import { User } from '../store/reducers/user';
import { queryKeys } from '../queries/keys';

interface Options {
  store?: ReturnType<typeof createStore>;
  initialEntries?: string[];
  /** Seed the settings query (merged onto the defaults). */
  settings?: DeepPartial<Settings>;
  /** Seed individual user queries by id (e.g. for balance-based validators). */
  users?: Record<string, DeepPartial<User>>;
}

function makeQueryClient(options: Options): QueryClient {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  client.setQueryData(queryKeys.settings, merge({}, defaultSettings, options.settings));
  Object.entries(options.users ?? {}).forEach(([id, user]) => {
    client.setQueryData(queryKeys.user(id), { id, ...user });
  });
  return client;
}

export function renderWithContext(
  ui: React.ReactElement,
  initialState: DeepPartial<AppState>,
  options: Options = {}
) {
  const store =
    options.store ?? createStore<any, any, any, any>(reducer, initialState);
  return render(
    <Provider store={store}>
      <QueryClientProvider client={makeQueryClient(options)}>
        <MemoryRouter initialEntries={options.initialEntries ?? ['/']}>
          <IntlProvider locale="en">{ui}</IntlProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export function renderWithIntl(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={makeQueryClient({})}>
      <IntlProvider locale="en" textComponent={React.Fragment}>
        {ui}
      </IntlProvider>
    </QueryClientProvider>
  );
}
