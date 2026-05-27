/* eslint-disable react/style-prop-object */

import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import { useSettings } from '../../store/selector-hooks';

interface Props {
  value: number;
  hidePlusSign?: boolean;
}

export function Currency({ value, hidePlusSign }: Props): React.JSX.Element {
  const { i18n } = useSettings();
  return (
    <>
      {value > 0 && !hidePlusSign ? '+' : ''}
      <FormattedNumber
        currency={i18n.currency.alpha3}
        value={value / 100}
        style="currency"
      />
    </>
  );
}
