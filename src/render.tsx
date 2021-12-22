import type {
  RenderOptions,
  Queries,
  queries,
  RenderResult,
} from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ThemeProvider } from './bricks';
import { en } from './locales/en';
import { store } from './store';

//@ts-expect-error mock this
window.scrollTo = vi.fn();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <IntlProvider textComponent={React.Fragment} locale="en" messages={en}>
          <HashRouter hashType="hashbang">{children}</HashRouter>
        </IntlProvider>
      </Provider>
    </ThemeProvider>
  );
};

const customRender = <
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement
>(
  ui: ReactElement,
  options: RenderOptions<Q, Container> = {}
): RenderResult<Q, Container> =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
