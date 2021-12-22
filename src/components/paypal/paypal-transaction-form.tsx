import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Currency, CurrencyInput } from '../currency';
import { useTransactionValidator } from '../transaction/validator';
import { AcceptButton, Flex } from '../../bricks';
import { useSettings } from '../settings/useSettings';

interface Props {
  userName: string;
  userId: string;
}

// eslint-disable-next-line react/display-name
export const PayPalTransactionForm = React.memo((props: Props) => {
  const formRef = React.useRef<HTMLFormElement | null>(null);
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

  const submit = () => {
    const { current } = formRef;
    if (current) {
      current.submit();
    }
  };

  return (
    <>
      <div>
        <form ref={formRef} action={BASE_URL} method="post">
          <Flex>
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
            <input type="hidden" name="rm" value="1" />
            <input
              type="hidden"
              name="currency_code"
              value={settings.i18n.currency.alpha3}
            />
            <AcceptButton
              margin="0 0 0 1rem"
              onClick={submit}
              disabled={!isValid}
            />
          </Flex>
        </form>
      </div>
      {fee && (
        <p>
          <FormattedMessage id="PAY_PAL_FEE_LABEL" defaultMessage="fee: " />
          <Currency value={fee * 100} />
        </p>
      )}
    </>
  );
});
