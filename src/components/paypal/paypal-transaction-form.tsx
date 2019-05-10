import { AcceptButton, styled } from 'bricks-of-sand';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useSettings } from '../../store';
import { Currency, CurrencyInput } from '../currency';
import { useTransactionValidator } from '../transaction/validator';

const Wrapper = styled('div')({
  form: {
    display: 'flex',
    marginBottom: '1rem',
  },
  input: {
    grow: 1,
    marginRight: '1rem',
  },
});

interface Props {
  userName: string;
  userId: string;
}

// eslint-disable-next-line react/display-name
export const PayPalTransactionForm = React.memo((props: Props) => {
  const settings = useSettings();
  const [value, setValue] = React.useState(0);
  const isValid = useTransactionValidator(value, props.userId);
  const numberAmount = value / 100;

  const BASE_URL = settings.paypal.sandbox
    ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
    : 'https://www.paypal.com/cgi-bin/webscr';
  const returnUrl = `${window.location.href}/${numberAmount}`;
  const returnCancelUrl = window.location.href;
  const fee = numberAmount * (settings.paypal.fee / 100) || null;
  const amount = fee ? numberAmount + fee : numberAmount;
  return (
    <>
      <Wrapper>
        <form action={BASE_URL} method="post">
          <CurrencyInput autoFocus value={value} onChange={setValue} />
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
          <input type="hidden" name="no_shipping" value="1" />
          <input type="hidden" name="no_note" value="1" />
          <input type="hidden" name="amount" value={amount} />
          <input type="hidden" name="return" value={returnUrl} />
          <input type="hidden" name="cancel_return" value={returnCancelUrl} />
          <input type="hidden" name="rm" value="0" />
          <input
            type="hidden"
            name="currency_code"
            value={settings.i18n.currency.alpha3}
          />
          <AcceptButton disabled={!isValid} />
        </form>
      </Wrapper>
      {fee && (
        <p>
          <FormattedMessage id="PAY_PAL_FEE_LABEL" defaultMessage="fee: " />
          <Currency value={fee * 100} />
        </p>
      )}
    </>
  );
});
