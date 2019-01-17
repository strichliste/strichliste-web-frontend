import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Boundary,
  getSettingsBalance,
  getUserBalance,
} from '../../store/reducers';

interface TransactionArguments {
  accountBoundary: Boundary;
  paymentBoundary: Boundary;
  isDeposit: boolean;
  balance: number | boolean;
  value: number;
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

interface OwnProps {
  userId?: number;
  value: number;
  isDeposit: boolean;
  render(isValid: boolean): JSX.Element;
}

interface StateProps {
  balance: number | boolean;
  accountBoundary: Boundary;
  paymentBoundary: Boundary;
}

export type TransactionValidatorProps = StateProps & OwnProps;

export function TransactionValidator(
  props: TransactionValidatorProps
): JSX.Element | null {
  const isValid = isTransactionValid({
    isDeposit: props.isDeposit,
    value: props.value,
    accountBoundary: props.accountBoundary,
    paymentBoundary: props.paymentBoundary,
    balance: props.balance,
  });
  return <>{props.render(isValid)}</>;
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  balance: props.userId
    ? getUserBalance(state, props.userId)
    : getSettingsBalance(state),
  accountBoundary: state.settings.account.boundary,
  paymentBoundary: state.settings.payment.boundary,
});

export const ConnectedTransactionValidator = connect(mapStateToProps)(
  TransactionValidator
);
