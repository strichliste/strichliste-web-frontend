import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSettings } from '../../queries';
import { useDeleteTransaction } from '../../queries/transactions';
import { Button } from '../../bricks';

interface Props {
  userId?: string;
  transactionId: number;
  onSuccess?(): void;
}

export function TransactionUndoButton(props: Props) {
  const undoEnabled = useSettings().payment.undo.enabled;
  const { mutate: deleteTransaction, isPending } = useDeleteTransaction();

  if (!undoEnabled || props.userId === undefined) {
    return null;
  }

  return (
    <Button
      padding="0"
      disabled={isPending}
      onClick={() => {
        if (typeof props.onSuccess === 'function') {
          props.onSuccess();
        }
        deleteTransaction({
          userId: props.userId || '',
          transactionId: props.transactionId,
        });
      }}
    >
      <FormattedMessage id="USER_TRANSACTION_UNDO" />
    </Button>
  );
}
