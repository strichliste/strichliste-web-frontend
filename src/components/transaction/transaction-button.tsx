import * as React from 'react';

import { useCreateTransaction } from '../../queries/transactions';
import { Currency } from '../currency';
import { useTransactionValidator } from './validator';
import { Button } from '../../bricks';

interface Props {
  userId: string;
  value: number;
  isDeposit?: boolean;
}

export function TransactionButton(props: Props): React.JSX.Element {
  const isValid = useTransactionValidator(
    props.value,
    props.userId,
    props.isDeposit
  );
  const { mutate, isPending } = useCreateTransaction();

  return (
    <Button
      green={props.isDeposit}
      red={!props.isDeposit}
      padding="0.8rem 0.5rem"
      onClick={() =>
        mutate({
          userId: props.userId,
          params: { amount: props.value },
        })
      }
      type="button"
      disabled={!isValid || isPending}
    >
      <Currency value={props.value} />
    </Button>
  );
}
