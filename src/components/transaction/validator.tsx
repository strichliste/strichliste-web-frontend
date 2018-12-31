import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Boundary,
  getSettingsBalance,
  getUserBalance,
} from '../../store/reducers';

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

  const isValid =
    (props.isDeposit ? newValue < boundaryValue : newValue > boundaryValue) &&
    props.value !== 0;
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
