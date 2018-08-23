import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { Payment, getPayment } from '../../store/reducers';
import { FormField } from '../ui';
import { CreateCustomTransactionLink } from './create-custom-transaction-link';
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
    <>
      <FormField>
        {props.payment.deposit.enabled && (
          <>
            <FormattedMessage id="PAYMENT_DEPOSIT_LABEL" />
            <PaymentButtonList
              isDeposit={true}
              boundary={props.payment.boundary}
              steps={props.payment.deposit.steps}
              userId={props.userId}
            />
          </>
        )}
      </FormField>
      <FormField>
        <CreateCustomTransactionLink isDeposit={true} />
      </FormField>
      <FormField>
        {props.payment.dispense.enabled && (
          <>
            <FormattedMessage id="PAYMENT_DISPENSE_LABEL" />
            <PaymentButtonList
              isDeposit={false}
              boundary={props.payment.boundary}
              steps={props.payment.dispense.steps}
              userId={props.userId}
            />
          </>
        )}
      </FormField>
      <FormField>
        <CreateCustomTransactionLink isDeposit={false} />
      </FormField>
    </>
  );
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  balance: state.user[props.userId].balance,
  payment: getPayment(state),
});

export const ConnectedPayment = connect(mapStateToProps)(Payment);
