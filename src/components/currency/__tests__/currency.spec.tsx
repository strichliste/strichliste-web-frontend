import * as React from 'react';
import { cleanup, render } from '@testing-library/react';

import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Currency } from '../';

afterEach(cleanup);

function renderWithStore(ui: JSX.Element) {
  // minimal reducer providing settings.i18n.currency.alpha3
  const reducer = () => ({ settings: { i18n: { currency: { alpha3: 'EUR' } } } });
  const store = createStore(reducer as any);
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('Currency', () => {
  it('matches the snapshot for english locales', () => {
    const { container } = renderWithStore(
      <IntlProvider defaultLocale="en">
        <Currency value={120} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it('hides plus icons by prop', () => {
    const { container } = renderWithStore(
      <IntlProvider defaultLocale="en">
        <Currency hidePlusSign value={120} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it('show - icons', () => {
    const { container } = renderWithStore(
      <IntlProvider defaultLocale="en">
        <Currency hidePlusSign value={-120} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
