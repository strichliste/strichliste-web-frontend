import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  isTransactionDeletable,
  startDeletingTransaction,
} from '../../store/reducers';

interface OwnProps {
  userId?: number;
  transactionId: number;
  onSuccess?(): void;
}

interface StateProps {
  canBeDeleted: boolean;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  startDeletingTransaction: any;
}

export type TransactionUndoButtonProps = ActionProps & StateProps & OwnProps;

export function TransactionUndoButton(
  props: TransactionUndoButtonProps
): JSX.Element | null {
  if (!props.canBeDeleted) {
    return null;
  }

  if (props.userId === undefined) {
    return null;
  }

  return (
    <div
      onClick={() => {
        if (typeof props.onSuccess === 'function') {
          props.onSuccess();
        }
        props.startDeletingTransaction(props.userId || 0, props.transactionId);
      }}
    >
      <FormattedMessage id="USER_TRANSACTION_UNDO" />
    </div>
  );
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  canBeDeleted: isTransactionDeletable(state, props.transactionId),
});

const mapDispatchToProps = {
  startDeletingTransaction,
};

export const ConnectedTransactionUndoButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionUndoButton);
