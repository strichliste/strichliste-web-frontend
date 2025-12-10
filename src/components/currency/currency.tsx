/* eslint-disable react/style-prop-object */

import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { getCurrencyAlpha3 } from '../../store/reducers/setting';

interface Props {
  value: number;
  hidePlusSign?: boolean;
  // optional override - ISO 4217 alpha-3 code like 'EUR', 'USD'
  currency?: string;
}

export function Currency({ value, hidePlusSign, currency }: Props): JSX.Element {
  // read currency from settings if not provided
  const settingsCurrency = useSelector((s: AppState) => getCurrencyAlpha3(s));
  const currencyCode = currency || settingsCurrency || 'EUR';

  return (
    <>
      {value > 0 && !hidePlusSign ? '+' : ''}
      <FormattedNumber currency={currencyCode} value={value / 100} style="currency" />
    </>
  );
}
