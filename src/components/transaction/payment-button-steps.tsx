import { ResponsiveGrid } from 'bricks-of-sand';
import * as React from 'react';
import { ConnectedTransactionButton } from '.';
import { Boundary } from '../../store/reducers';
import { ConnectedTransactionValidator } from './validator';

export interface PaymentButtonListProps {
  steps: number[];
  userId: number;
  boundary: Boundary;
  isDeposit: boolean;
}

export function PaymentButtonList(props: PaymentButtonListProps): JSX.Element {
  const multiplier = props.isDeposit ? 1 : -1;
  return (
    <ResponsiveGrid gridGap="1rem" columns="1fr 1fr 1fr">
      {props.steps.map(step => (
        <ConnectedTransactionValidator
          key={step}
          userId={props.userId}
          boundary={props.boundary}
          value={step}
          isDeposit={props.isDeposit}
          render={isValid => (
            <ConnectedTransactionButton
              isDeposit={props.isDeposit}
              userId={props.userId}
              value={step * multiplier}
              disabled={!isValid}
            />
          )}
        />
      ))}
    </ResponsiveGrid>
  );
}
