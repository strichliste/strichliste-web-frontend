import React from 'react';
import { useUserBalance } from '../../store';
import { useSettings } from '../settings/useSettings';

export function useArticleValidator(value: number, userId = ''): boolean {
  const settings = useSettings();
  const userBalance = useUserBalance(userId);
  const boundary = settings.payment.boundary;

  if (userId) {
    const newValue =
      (typeof userBalance === 'boolean' ? 0 : userBalance) - value;
    return boundary.lower < newValue;
  } else {
    return value > 0 && value * -1 > boundary.lower;
  }
}

interface Props {
  value: number;
  userId?: string;
  render(isValid: boolean): React.ReactNode;
}
export const ArticleValidator = (props: Props) => {
  const isValid = useArticleValidator(props.value, props.userId);
  const test = 'sdfsd';
  return <>{props.render(isValid)}</>;
};
