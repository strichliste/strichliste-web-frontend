import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';

interface OwnProps {
  value: number;
}

// interface StateProps

type Props = OwnProps;

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

export const ConnectedCurrency = connect()(Currency);
