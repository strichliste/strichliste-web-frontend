import { Block, styled } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { useDispatch } from 'redux-react-hook';

import { useUserName } from '../../store';
import { Transaction, startCreatingTransaction } from '../../store/reducers';
import { getUserDetailLink, getUserPayPalLink } from '../user/user-router';
import { PayPalTransactionForm } from './paypal-transaction-form';

const H2 = styled('h2')({
  textAlign: 'center',
  marginBottom: '1rem',
});

export type PayPalTransactionProps = RouteComponentProps<{
  id: string;
  state: string;
  amount: string;
}>;

export const PayPalTransaction = withRouter((props: PayPalTransactionProps) => {
  const userId = props.match.params.id;
  const paidAmount = Number(props.match.params.amount);

  const userName = useUserName(userId);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (paidAmount) {
      startCreatingTransaction(dispatch, userId, {
        amount: paidAmount * 100,
        comment: 'paypal',
      }).then((response: Transaction | undefined) => {
        if (response && response) {
          props.history.push(getUserDetailLink(userId));
        } else {
          props.history.push(`${getUserPayPalLink(userId)}/error`);
        }
      });
    }
  }, [paidAmount]);

  return (
    <Block padding="2rem 0">
      <H2>
        <FormattedMessage
          id="PAYPAL_HEADING"
          defaultMessage="Charge by paypal"
        />
      </H2>
      {props.match.params.amount === 'error' ? (
        <FormattedMessage
          id="PAYPAL_ERROR"
          defaultMessage="Could not create the STRICHLISTE Transaction :("
        />
      ) : (
        <PayPalTransactionForm userName={userName} userId={userId} />
      )}
    </Block>
  );
});
