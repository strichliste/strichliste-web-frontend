import * as React from 'react';
import { merge } from 'lodash';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

import { DeepPartial, Settings, User } from '../types';
import { defaultSettings } from '../types/settings';
import { queryKeys } from '../queries/keys';

interface Options {
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
  options: Options = {}
) {
  return render(
    <QueryClientProvider client={makeQueryClient(options)}>
      <MemoryRouter initialEntries={options.initialEntries ?? ['/']}>
        <IntlProvider locale="en">{ui}</IntlProvider>
      </MemoryRouter>
    </QueryClientProvider>
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
