import { Block } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { useDispatch } from 'redux-react-hook';

import { useUserName } from '../../store';
import { Transaction, startCreatingTransaction } from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { useTransactionValidator } from '../transaction/validator';
import { getUserDetailLink, getUserPayPalLink } from '../user/user-router';
import { PayPalTransactionButton } from './paypal-transaction-button';

export interface PayPalTransactionProps
  extends RouteComponentProps<{ id: string; state: string; amount: string }> {}

export const PayPalTransaction = withRouter((props: PayPalTransactionProps) => {
  const userId = Number(props.match.params.id);
  const paidAmount = Number(props.match.params.amount);

  const [value, setValue] = React.useState(0);
  const userName = useUserName(userId);
  const isValid = useTransactionValidator(value, userId);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (paidAmount) {
      dispatch(
        // @ts-ignore
        startCreatingTransaction(userId, {
          amount: paidAmount * 100,
          comment: 'paypal',
        })
      ).then((response: Transaction | undefined) => {
        if (response && response) {
          props.history.push(getUserDetailLink(userId));
        } else {
          props.history.push(`${getUserPayPalLink(userId)}/error`);
        }
      });
    }
  }, [paidAmount]);

  return (
    <Block padding="2rem">
      <h2>
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
        <>
          <CurrencyInput value={value} onChange={setValue} />
          <Block margin="1rem 0 0 0">
            <PayPalTransactionButton
              amount={value / 100}
              userName={userName}
              disabled={!isValid}
            />
          </Block>
        </>
      )}
    </Block>
  );
});
