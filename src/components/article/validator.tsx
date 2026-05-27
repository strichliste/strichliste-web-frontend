import React from 'react';
import { useSettings, useUserBalance } from '../../store';

export function useArticleValidator(
  value: number,
  userId: string = ''
): boolean {
  const settings = useSettings();
  const userBalance = useUserBalance(userId);
  const boundary = settings.payment.boundary;
  // boundary.lower may be `false` (disabled); coerce to a number for comparison.
  const lower = Number(boundary.lower);

  if (userId) {
    const newValue =
      (typeof userBalance === 'boolean' ? 0 : userBalance) - value;
    return lower < newValue;
  } else {
    return value > 0 && value * -1 > lower;
  }
}

interface Props {
  value: number;
  userId?: string;
  render(isValid: boolean): React.ReactNode;
}
export const ArticleValidator = (props: Props) => {
  const isValid = useArticleValidator(props.value, props.userId);
  return <>{props.render(isValid)}</>;
};
