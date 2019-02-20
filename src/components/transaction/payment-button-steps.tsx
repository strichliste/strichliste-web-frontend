import { ResponsiveGrid } from 'bricks-of-sand';
import * as React from 'react';
import { TransactionButton } from './transaction-button';

export interface PaymentButtonListProps {
  steps: number[];
  userId: number;
  isDeposit: boolean;
}

export function PaymentButtonList(props: PaymentButtonListProps): JSX.Element {
  const multiplier = props.isDeposit ? 1 : -1;
  return (
    <ResponsiveGrid gridGap="1rem" columns="1fr 1fr 1fr">
      {props.steps.map(step => (
        <TransactionButton
          key={step}
          isDeposit={props.isDeposit}
          userId={props.userId}
          value={step * multiplier}
        />
      ))}
    </ResponsiveGrid>
  );
}
