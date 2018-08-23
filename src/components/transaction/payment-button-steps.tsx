import * as React from 'react';
import { ConnectedTransactionButton } from '.';
import { Boundary } from '../../store/reducers';
import { Column, Row, theme } from '../ui';
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
    <Row>
      {props.steps.map((step, index) => (
        <Column
          margin={index !== props.steps.length - 1 ? '0 0.5rem 0 0' : ''}
          key={step}
        >
          <ConnectedTransactionValidator
            userId={props.userId}
            boundary={props.boundary}
            value={step}
            isDeposit={props.isDeposit}
            render={isValid => (
              <ConnectedTransactionButton
                color={props.isDeposit ? theme.green : theme.red}
                userId={props.userId}
                value={step * multiplier}
                disabled={!isValid}
              />
            )}
          />
        </Column>
      ))}
    </Row>
  );
}
