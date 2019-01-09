import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Boundary,
  getSettingsBalance,
  getUserBalance,
} from '../../store/reducers';

interface TransactionArguments {
  boundary: Boundary;
  isDeposit: boolean;
  balance: number;
  value: number;
}
export const isTransactionValid = ({
  boundary,
  isDeposit,
  balance,
  value,
}: TransactionArguments): boolean => {
  const boundaryValue = isDeposit ? boundary.upper : boundary.lower;
  const newValue = isDeposit ? value + balance : balance - value;

  return (
    (isDeposit ? newValue < boundaryValue : newValue > boundaryValue) &&
    value !== 0
  );
};

interface OwnProps {
  userId?: number;
  value: number;
  isDeposit: boolean;
  render(isValid: boolean): JSX.Element;
}

interface StateProps {
  balance: number;
  boundary: Boundary;
}

export type TransactionValidatorProps = StateProps & OwnProps;

export function TransactionValidator(
  props: TransactionValidatorProps
): JSX.Element | null {
  const isValid = isTransactionValid({
    isDeposit: props.isDeposit,
    value: props.value,
    boundary: props.boundary,
    balance: props.balance,
  });
  return <>{props.render(isValid)}</>;
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  balance: props.userId
    ? getUserBalance(state, props.userId)
    : getSettingsBalance(state),
  boundary: state.settings.payment.boundary,
});

export const ConnectedTransactionValidator = connect(mapStateToProps)(
  TransactionValidator
);
