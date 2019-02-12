import { AcceptButton, styled } from 'bricks-of-sand';
import React from 'react';

import { useSettings } from '../../store';
import { CurrencyInput } from '../currency';
import { useTransactionValidator } from '../transaction/validator';

const Wrapper = styled('div')({
  form: {
    display: 'flex',
  },
  input: {
    grow: 1,
    marginRight: '1rem',
  },
});

interface Props {
  userName: string;
  userId: number;
}

export const PayPalTransactionForm = React.memo((props: Props) => {
  const settings = useSettings();
  const [value, setValue] = React.useState(0);
  const isValid = useTransactionValidator(value, props.userId);
  const numberAmount = value / 100;

  const BASE_URL = settings.paypal.sandbox
    ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
    : 'https://www.paypal.com/cgi-bin/webscr';
  const returnUrl = `${location.href}/${numberAmount}`;
  const returnCancelUrl = location.href;
  const amount = settings.paypal.fee
    ? numberAmount + numberAmount * (settings.paypal.fee / 100)
    : numberAmount;

  return (
    <Wrapper>
      <form action={BASE_URL} method="post">
        <CurrencyInput value={value} onChange={setValue} />
        <input type="hidden" name="cmd" value="_xclick" />
        <input
          type="hidden"
          name="business"
          value={settings.paypal.recipient}
        />
        <input
          type="hidden"
          name="item_name"
          value={`STRICHLISTE: ${props.userName}`}
        />
        <input
          type="hidden"
          name="cbt"
          value="Click to complete Strichliste transaction"
        />
        <input type="hidden" name="no_shipping" value="1" />
        <input type="hidden" name="no_note" value="1" />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="return" value={returnUrl} />
        <input type="hidden" name="cancel_return" value={returnCancelUrl} />
        <input
          type="hidden"
          name="currency_code"
          value={settings.i18n.currency.alpha3}
        />
        <AcceptButton disabled={!isValid} />
      </form>
    </Wrapper>
  );
});
