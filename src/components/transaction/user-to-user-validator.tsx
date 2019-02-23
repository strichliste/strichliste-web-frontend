import * as React from 'react';
import { useTransactionValidator } from './validator';

interface Props {
  userId: string;
  targetUserId: string;
  value: number;
  render(isValid: boolean): JSX.Element;
}

export function UserToUserValidator(props: Props): JSX.Element | null {
  const userHasTheMoney = useTransactionValidator(
    props.value,
    props.userId,
    false
  );
  const receiverCanAcceptTheMoney = useTransactionValidator(
    props.value,
    props.targetUserId,
    true
  );
  return <>{props.render(userHasTheMoney && receiverCanAcceptTheMoney)} </>;
}
