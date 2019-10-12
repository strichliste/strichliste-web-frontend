import React from 'react';

import { useDispatch } from 'redux-react-hook';
import { useIntl } from 'react-intl';

import { startCreatingTransaction } from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { useTransactionValidator } from './validator';
import { useSettings } from '../../store';
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
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const depositIsValid = useTransactionValidator(value, userId, true);
  const dispenseIsValid = useTransactionValidator(value, userId, false);

  const submit = async (isDeposit: boolean) => {
    const multiplier = isDeposit ? 1 : -1;
    const amount = value * multiplier;

    const result = await startCreatingTransaction(dispatch, userId, {
      amount,
    });

    if (transactionCreated) {
      transactionCreated();
    }

    if (result) {
      setValue(0);
    }
  };
  return (
    <div className={styles.userTransactionGrid}>
      {payment.dispense.custom ? (
        <Button
          red
          title={intl.formatMessage({ id: 'BALANCE_DISPENSE' })}
          onClick={() => submit(false)}
          fab
          disabled={!dispenseIsValid}
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
          disabled={!depositIsValid}
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
