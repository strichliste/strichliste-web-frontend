import { AcceptButton } from 'bricks-of-sand';
import React from 'react';
import { useSettings } from '../../store';

interface Props {
  userName: string;
  amount: number;
}

export const PayPalTransactionButton = React.memo((props: Props) => {
  const settings = useSettings();
  const BASE_URL = settings.paypal.sandbox
    ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
    : 'https://www.paypal.com/cgi-bin/webscr';
  const returnUrl = `${location.href}/${props.amount}`;
  const returnCancelUrl = location.href;
  const amount = settings.paypal.fee
    ? props.amount + props.amount * (settings.paypal.fee / 100)
    : props.amount;

  return (
    <div>
      <form action={BASE_URL} method="post">
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
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="return" value={returnUrl} />
        <input type="hidden" name="cancel_return" value={returnCancelUrl} />
        <input
          type="hidden"
          name="currency_code"
          value={settings.i18n.currency.alpha3}
        />
        <AcceptButton />
      </form>
    </div>
  );
});
