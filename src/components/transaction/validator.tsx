import { useSettings, useUserBalance } from '../../store';
import { Boundary } from '../../store/reducers';

interface TransactionArguments {
  accountBoundary: Boundary;
  paymentBoundary: Boundary;
  isDeposit: boolean;
  balance: number | boolean;
  value: number;
}

interface CheckValidProps {
  accountBoundaryValue: number | boolean;
  paymentBoundaryValue: number | boolean;
  balance: number | boolean;
  value: number;
}

function checkDepositIsValid({
  accountBoundaryValue,
  paymentBoundaryValue,
  balance,
  value,
}: CheckValidProps): boolean {
  if (
    typeof paymentBoundaryValue === 'number' &&
    value > paymentBoundaryValue
  ) {
    return false;
  }

  if (
    typeof accountBoundaryValue === 'boolean' ||
    typeof balance === 'boolean'
  ) {
    return true;
  }
  return value + balance < accountBoundaryValue;
}

function checkDispenseIsValid({
  accountBoundaryValue,
  paymentBoundaryValue,
  balance,
  value,
}: CheckValidProps): boolean {
  if (
    typeof paymentBoundaryValue === 'number' &&
    value > paymentBoundaryValue * -1
  ) {
    return false;
  }

  if (
    typeof accountBoundaryValue === 'boolean' ||
    typeof balance === 'boolean'
  ) {
    return true;
  }
  return balance - value > accountBoundaryValue;
}

export const isTransactionValid = ({
  accountBoundary,
  paymentBoundary,
  isDeposit,
  balance,
  value,
}: TransactionArguments): boolean => {
  if (value === 0) {
    return false;
  }
  if (isDeposit) {
    return checkDepositIsValid({
      accountBoundaryValue: accountBoundary.upper,
      paymentBoundaryValue: paymentBoundary.upper,
      value,
      balance,
    });
  } else {
    return checkDispenseIsValid({
      accountBoundaryValue: accountBoundary.lower,
      paymentBoundaryValue: paymentBoundary.lower,
      value,
      balance,
    });
  }
};

export function useTransactionValidator(
  value: number,
  userId: string,
  isDeposit: boolean = true
): boolean {
  const settings = useSettings();
  const balance = useUserBalance(userId);

  return isTransactionValid({
    value,
    balance,
    isDeposit,
    accountBoundary: settings.account.boundary,
    paymentBoundary: settings.payment.boundary,
  });
}
