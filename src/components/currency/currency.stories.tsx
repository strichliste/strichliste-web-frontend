import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { IntlProvider } from 'react-intl';
import { MaterialInput } from '../ui';
import { Currency, CurrencyInput } from './';

// tslint:disable-next-line:no-any
storiesOf('Components/Currency', module).add('Input_EN', () => (
  <div>
    EN
    <div>
      <IntlProvider>
        <>
          <Currency value={120} />
          <CurrencyInput value={120} />
        </>
      </IntlProvider>
    </div>
    <hr />
    DE
    <div>
      <IntlProvider defaultLocale="de">
        <>
          <Currency value={120} />
          <CurrencyInput value={120} />
        </>
      </IntlProvider>
    </div>
    <MaterialInput>
      <IntlProvider defaultLocale="de">
        <CurrencyInput value={120} />
      </IntlProvider>
    </MaterialInput>
  </div>
));

// tslint:disable-next-line:no-any
storiesOf('Components/Currency', module).add('Input_DE', () => (
  <IntlProvider defaultLocale="de">
    <Currency value={120} />
  </IntlProvider>
));
