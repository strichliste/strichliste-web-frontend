import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from '../../routing';

import { useUserName } from '../../queries';
import { useCreateTransaction } from '../../queries/transactions';
import { getUserDetailLink, getUserPayPalLink } from '../user/user-router';
import { PayPalTransactionForm } from './paypal-transaction-form';

export type PayPalTransactionProps = RouteComponentProps<{
  id: string;
  state: string;
  amount: string;
}>;

export const PayPalTransaction = withRouter((props: PayPalTransactionProps) => {
  const userId = props.match.params.id;
  const paidAmount = Number(props.match.params.amount);

  const userName = useUserName(userId);
  const { mutateAsync: createTransaction } = useCreateTransaction();

  React.useEffect(() => {
    if (paidAmount) {
      createTransaction({
        userId,
        params: { amount: paidAmount * 100, comment: 'paypal' },
      }).then((response) => {
        if (response) {
          props.history.push(getUserDetailLink(userId));
        } else {
          props.history.push(`${getUserPayPalLink(userId)}/error`);
        }
      });
    }
    // eslint-disable-next-line
  }, [paidAmount]);

  return (
    <>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        <FormattedMessage
          id="PAYPAL_HEADING"
          defaultMessage="Charge by paypal"
        />
      </h2>
      {props.match.params.amount === 'error' ? (
        <FormattedMessage
          id="PAYPAL_ERROR"
          defaultMessage="Could not create the STRICHLISTE Transaction :("
        />
      ) : (
        <PayPalTransactionForm userName={userName} userId={userId} />
      )}
    </>
  );
});
