import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSettings } from '../../store';
import { deleteTransaction } from '../../queries/transactions';
import { Button } from '../../bricks';

interface Props {
  userId?: string;
  transactionId: number;
  onSuccess?(): void;
}

export function TransactionUndoButton(props: Props) {
  const undoEnabled = useSettings().payment.undo.enabled;

  if (!undoEnabled || props.userId === undefined) {
    return null;
  }

  return (
    <Button
      padding="0"
      onClick={() => {
        if (typeof props.onSuccess === 'function') {
          props.onSuccess();
        }
        deleteTransaction(props.userId || '', props.transactionId);
      }}
    >
      <FormattedMessage id="USER_TRANSACTION_UNDO" />
    </Button>
  );
}
