import React from 'react';

import { useIntl } from 'react-intl';

import { useCreateTransaction } from '../../queries/transactions';
import { CurrencyInput } from '../currency';
import { useTransactionValidator } from './validator';
import { useSettings } from '../../queries';
import { Button } from '../../bricks';

import styles from './create-user-transaction-form.module.css';

interface Props {
  userId: string;
  transactionCreated?(): void;
}

export const CreateCustomTransactionForm = (props: Props) => {
  const intl = useIntl();
  const { userId, transactionCreated } = props;
  const payment = useSettings().payment;
  const [value, setValue] = React.useState(0);
  const depositIsValid = useTransactionValidator(value, userId, true);
  const dispenseIsValid = useTransactionValidator(value, userId, false);
  const { mutateAsync, isPending } = useCreateTransaction();

  const submit = async (isDeposit: boolean) => {
    const multiplier = isDeposit ? 1 : -1;
    const amount = value * multiplier;

    try {
      await mutateAsync({ userId, params: { amount } });
      setValue(0);
    } catch {
      // mutationCache.onError surfaced a toast; keep the entered amount so
      // the user can retry without re-typing.
    }
    transactionCreated?.();
  };
  return (
    <div className={styles.userTransactionGrid}>
      {payment.dispense.custom ? (
        <Button
          red
          title={intl.formatMessage({ id: 'BALANCE_DISPENSE' })}
          onClick={() => submit(false)}
          fab
          disabled={!dispenseIsValid || isPending}
          type="submit"
        >
          -
        </Button>
      ) : (
        <div></div>
      )}
      <CurrencyInput
        value={value}
        placeholder={intl.formatMessage({ id: 'BALANCE_PLACEHOLDER' })}
        onChange={setValue}
      />
      {payment.deposit.custom ? (
        <Button
          green
          title={intl.formatMessage({ id: 'BALANCE_DEPOSIT' })}
          onClick={() => submit(true)}
          fab
          disabled={!depositIsValid || isPending}
          type="submit"
        >
          +
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
