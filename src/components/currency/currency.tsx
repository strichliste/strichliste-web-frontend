import * as React from 'react';
import { FormattedNumber } from 'react-intl';

interface Props {
  value: number;
}

export function Currency(props: Props): JSX.Element {
  return (
    <>
      {props.value > 0 ? '+' : ''}
      <FormattedNumber
        currency="EUR"
        value={props.value / 100}
        style="currency"
      />
    </>
  );
}
