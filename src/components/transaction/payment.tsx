import * as React from 'react';
import { connect } from 'react-redux';

import { Block, Card } from 'bricks-of-sand';
import { ConnectedCreateCustomTransactionForm } from '.';
import { AppState } from '../../store';
import { Payment, getPayment } from '../../store/reducers';
import { FormField } from '../ui';
import { PaymentButtonList } from './payment-button-steps';

interface OwnProps {
  userId: number;
}

interface StateProps {
  balance: number;
  payment: Payment;
}

type Props = OwnProps & StateProps;

export function Payment(props: Props): JSX.Element {
  return (
    <Card padding="0.5rem">
      <FormField>
        {props.payment.deposit.enabled && (
          <PaymentButtonList
            isDeposit={true}
            boundary={props.payment.boundary}
            steps={props.payment.deposit.steps}
            userId={props.userId}
          />
        )}
      </FormField>
      <Block margin="1rem">
        <ConnectedCreateCustomTransactionForm userId={props.userId} />
      </Block>
      <FormField>
        {props.payment.dispense.enabled && (
          <PaymentButtonList
            isDeposit={false}
            boundary={props.payment.boundary}
            steps={props.payment.dispense.steps}
            userId={props.userId}
          />
        )}
      </FormField>
    </Card>
  );
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  balance: state.user[props.userId].balance,
  payment: getPayment(state),
});

export const ConnectedPayment = connect(mapStateToProps)(Payment);
