/* eslint-disable react/style-prop-object */

import * as React from 'react';
import { FormattedNumberParts } from 'react-intl';
import { useSettings } from '../../store';

interface Props {
  value: number;
  hidePlusSign?: boolean;
}

export function Currency({ value, hidePlusSign }: Props): JSX.Element {
  const settings = useSettings();
  const customCurrencySign = settings.i18n.currency.symbol;

  return (
    <>
      {value > 0 && !hidePlusSign ? '+' : ''}
      <FormattedNumberParts
        value={value / 100}
        style={'currency'}
        currency={'EUR'}
        children={function (
          parts: Intl.NumberFormatPart[]
        ): React.ReactElement | null {
          return (
            <>
              {parts.map((part) => {
                if ((part.type === 'currency') && customCurrencySign) {
                  return <>{customCurrencySign}</>;
                } else {
                  return <>{part.value}</>;
                }
              })}
            </>
          );
        }}
      />
    </>
  );
}
