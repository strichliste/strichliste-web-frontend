import React from 'react';

import { GreenButton, RedButton, ResponsiveGrid, styled } from 'bricks-of-sand';
import { useDispatch } from 'redux-react-hook';
import { useIntl } from 'react-intl';

import { startCreatingTransaction } from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { useTransactionValidator } from './validator';
import { useSettings } from '../../store';
import { en } from '../../locales/en';

const ButtonText = styled('div')({
  fontSize: '1rem',
  fontWeight: 'bold',
  lineHeight: 0,
});

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
    <ResponsiveGrid gridGap="1rem" columns="3rem 1fr 3rem">
      {payment.dispense.custom ? (
        <RedButton
          title={intl.formatMessage({ id: en.BALANCE_DISPENSE })}
          onClick={() => submit(false)}
          isRound
          disabled={!dispenseIsValid}
          type="submit"
        >
          <ButtonText>-</ButtonText>
        </RedButton>
      ) : (
        <div></div>
      )}
      <CurrencyInput
        value={value}
        placeholder={intl.formatMessage({ id: en.BALANCE_PLACEHOLDER })}
        onChange={setValue}
      />
      {payment.deposit.custom ? (
        <GreenButton
          title={intl.formatMessage({ id: en.BALANCE_DEPOSIT })}
          onClick={() => submit(true)}
          isRound
          disabled={!depositIsValid}
          type="submit"
        >
          <ButtonText>+</ButtonText>
        </GreenButton>
      ) : (
        <div></div>
      )}
    </ResponsiveGrid>
  );
};
