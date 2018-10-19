import * as React from 'react';
import { cleanup, render } from 'react-testing-library';

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
});
