import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useIsTransactionDeletable, store } from '../../store';
import { startDeletingTransaction } from '../../store/reducers';

interface Props {
  userId?: number;
  transactionId: number;
  onSuccess?(): void;
}

export function TransactionUndoButton(props: Props) {
  const isDeletable = useIsTransactionDeletable(props.transactionId);

  if (!isDeletable) {
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
        startDeletingTransaction(
          store.dispatch,
          props.userId || 0,
          props.transactionId
        );
      }}
    >
      <FormattedMessage id="USER_TRANSACTION_UNDO" />
    </div>
  );
}
