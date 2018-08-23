import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { Boundary } from '../../store/reducers';

interface OwnProps {
  userId: number;
  value: number;
  isDeposit: boolean;
  boundary: Boundary;
  render(isValid: boolean): JSX.Element;
}

interface StateProps {
  balance: number;
}

interface ActionProps {}

export type TransactionValidatorProps = ActionProps & StateProps & OwnProps;

export function TransactionValidator(
  props: TransactionValidatorProps
): JSX.Element | null {
  const boundary = props.boundary;
  const boundaryValue = props.isDeposit ? boundary.upper : boundary.lower;
  const newValue = props.isDeposit
    ? props.value + props.balance
    : props.balance - props.value;

  const isValid = props.isDeposit
    ? newValue < boundaryValue
    : newValue > boundaryValue;
  return <>{props.render(isValid)}</>;
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  balance: state.user[props.userId].balance,
});

export const ConnectedTransactionValidator = connect(mapStateToProps)(
  TransactionValidator
);
