import * as React from 'react';
import { cleanup, render } from '@testing-library/react';

import { IntlProvider } from 'react-intl';
import { Currency } from '../';

afterEach(cleanup);

describe('Currency', () => {
  it('matches the snapshot for english locales', () => {
    const { container } = render(
      <IntlProvider defaultLocale="en">
        <Currency value={120} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it('hides plus icons by prop', () => {
    const { container } = render(
      <IntlProvider defaultLocale="en">
        <Currency hidePlusSign value={120} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it('show - icons', () => {
    const { container } = render(
      <IntlProvider defaultLocale="en">
        <Currency hidePlusSign value={-120} />
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
