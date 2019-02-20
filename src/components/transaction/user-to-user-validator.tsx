import * as React from 'react';
import { useTransactionValidator } from './validator';

interface Props {
  userId: number;
  targetUserId: number;
  value: number;
  render(isValid: boolean): JSX.Element;
}

export function UserToUserValidator(props: Props): JSX.Element | null {
  const userHasTheMoney = useTransactionValidator(
    props.userId,
    props.value,
    false
  );
  const receiverCanAcceptTheMoney = useTransactionValidator(
    props.targetUserId,
    props.value,
    true
  );
  return <>{props.render(userHasTheMoney && receiverCanAcceptTheMoney)} </>;
}
