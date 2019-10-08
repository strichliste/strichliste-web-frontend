import * as React from 'react';
import { TransactionButton } from './transaction-button';
import { Grid_3 } from '../../bricks';

export interface PaymentButtonListProps {
  steps: number[];
  userId: string;
  isDeposit: boolean;
}

export function PaymentButtonList(props: PaymentButtonListProps): JSX.Element {
  const multiplier = props.isDeposit ? 1 : -1;
  return (
    <Grid_3>
      {props.steps.map(step => (
        <TransactionButton
          key={step}
          isDeposit={props.isDeposit}
          userId={props.userId}
          value={step * multiplier}
        />
      ))}
    </Grid_3>
  );
}
