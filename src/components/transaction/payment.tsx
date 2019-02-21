import { Block, Card } from 'bricks-of-sand';
import * as React from 'react';

import { useSettings } from '../../store';
import { CreateCustomTransactionForm } from './create-custom-transaction-form';
import { PaymentButtonList } from './payment-button-steps';

interface Props {
  userId: string;
}

export function Payment(props: Props): JSX.Element {
  const payment = useSettings().payment;
  return (
    <Card padding="0.5rem">
      {payment.deposit.enabled && (
        <PaymentButtonList
          isDeposit={true}
          steps={payment.deposit.steps}
          userId={props.userId}
        />
      )}
      <Block margin="1rem">
        <CreateCustomTransactionForm userId={props.userId} />
      </Block>
      {payment.dispense.enabled && (
        <PaymentButtonList
          isDeposit={false}
          steps={payment.dispense.steps}
          userId={props.userId}
        />
      )}
    </Card>
  );
}
