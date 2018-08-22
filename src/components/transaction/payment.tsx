import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { Payment, getPayment } from '../../store/reducers';
import { Column, FormField, Row, theme } from '../ui';
import { CreateCustomTransactionLink } from './create-custom-transaction-link';
import { ConnectedTransactionButton } from './transaction-button';

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
            <Row>
              {props.payment.deposit.steps.map(step => (
                <Column margin="0 0.5rem 0 0" key={step}>
                  <ConnectedTransactionButton
                    color={theme.green}
                    userId={props.userId}
                    value={step}
                  />
                </Column>
              ))}
            </Row>
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
            <Row>
              {props.payment.dispense.steps.map(step => (
                <Column margin="0 0.5rem 0 0" key={step}>
                  <ConnectedTransactionButton
                    color={theme.red}
                    userId={props.userId}
                    value={step * -1}
                  />
                </Column>
              ))}
            </Row>
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
