import React from 'react';

import { GreenButton, RedButton, ResponsiveGrid, styled } from 'bricks-of-sand';
import { useDispatch } from 'redux-react-hook';
import { startCreatingTransaction } from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { useTransactionValidator } from './validator';

const ButtonText = styled('div')({
  fontSize: '1rem',
  fontWeight: 'bold',
  lineHeight: 0,
});

interface Props {
  userId: number;
  transactionCreated?(): void;
}

export const CreateCustomTransactionForm = (props: Props) => {
  const { userId, transactionCreated } = props;

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
      <RedButton
        onClick={() => submit(false)}
        isRound
        disabled={!dispenseIsValid}
        type="submit"
      >
        <ButtonText>-</ButtonText>
      </RedButton>
      <CurrencyInput
        value={value}
        placeholder="CUSTOM AMOUNT"
        onChange={setValue}
      />
      <GreenButton
        onClick={() => submit(true)}
        isRound
        disabled={!depositIsValid}
        type="submit"
      >
        <ButtonText>+</ButtonText>
      </GreenButton>
    </ResponsiveGrid>
  );
};
