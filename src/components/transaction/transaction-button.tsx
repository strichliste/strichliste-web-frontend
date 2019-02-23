import * as React from 'react';

import { GreenButton, RedButton } from 'bricks-of-sand';
import { startCreatingTransaction } from '../../store/reducers';
import { Currency } from '../currency';
import { useTransactionValidator } from './validator';
import { store } from '../../store';

interface Props {
  userId: string;
  value: number;
  isDeposit?: boolean;
}

export function TransactionButton(props: Props): JSX.Element {
  const Button = props.isDeposit ? GreenButton : RedButton;
  const isValid = useTransactionValidator(
    props.value,
    props.userId,
    props.isDeposit
  );

  return (
    <Button
      padding="0.8rem 0.5rem"
      onClick={() =>
        startCreatingTransaction(store.dispatch, props.userId, {
          amount: props.value,
        })
      }
      type="button"
      disabled={!isValid}
    >
      <Currency value={props.value} />
    </Button>
  );
}
