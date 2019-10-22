/* eslint-disable react/style-prop-object */

import * as React from 'react';
import { FormattedNumber } from 'react-intl';

interface Props {
  value: number;
  hidePlusSign?: boolean;
}

export function Currency({ value, hidePlusSign }: Props): JSX.Element {
  return (
    <>
      {value > 0 && !hidePlusSign ? '+' : ''}
      <FormattedNumber currency="EUR" value={value / 100} style="currency" />
    </>
  );
}
