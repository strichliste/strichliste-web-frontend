import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouter } from '../../routing';
import { User } from '../../types';
import { useCreateTransaction } from '../../queries/transactions';
import { Currency, CurrencyInput } from '../currency';
import { UserSelection } from '../user';
import { UserName } from '../user/user-name';
import { TransactionUndoButton } from './transaction-undo-button';
import { UserToUserValidator } from './user-to-user-validator';
import { Card, AcceptIcon, AcceptButton, Input, Arrow } from '../../bricks';

import styles from './create-user-transaction-form.module.css';

const emptyUser: User = {
  id: '',
  name: '',
  isActive: false,
  balance: 0,
  created: '',
  transactions: {},
};

export function CreateUserTransactionForm(): React.JSX.Element {
  const { match } = useRouter<{ id: string }>();
  const userId = match.params.id;
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();

  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [selectedUser, setSelectedUser] = React.useState<User>(emptyUser);
  const [comment, setComment] = React.useState('');
  const [createdTransactionId, setCreatedTransactionId] = React.useState(0);
  const [hasSelectionReady, setHasSelectionReady] = React.useState(false);

  const handleUserPick = (user: User) => {
    if (!selectedUser.id) setSelectedUser(user);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser.id || !selectedAmount || isPending) return;
    const res = await createTransaction({
      userId,
      params: {
        amount: selectedAmount * -1,
        recipientId: selectedUser.id,
        comment,
      },
    });
    if (res && res.id) {
      setHasSelectionReady(true);
      setCreatedTransactionId(res.id);
    }
  };

  if (hasSelectionReady) {
    return (
      <Card
        margin="1rem 0"
        style={{
          justifyContent: 'space-between',
          alignContent: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <div>
          <AcceptIcon style={{ marginRight: '1rem' }} />
          <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_SUCCESS" />{' '}
          <UserName width="120px" name={selectedUser.name} />
          &#8594;
          <Currency value={selectedAmount} />
        </div>
        <TransactionUndoButton
          onSuccess={() => setHasSelectionReady(false)}
          transactionId={createdTransactionId}
          userId={userId || ''}
        />
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <FormattedMessage
          defaultMessage="Amount"
          id="USER_TRANSACTION_FROM_AMOUNT_LABEL"
        >
          {(text) => (
            <CurrencyInput
              noNegative
              placeholder={text as unknown as string}
              autoFocus
              onChange={setSelectedAmount}
            />
          )}
        </FormattedMessage>
        <Arrow style={{ width: ' 1rem', height: '1rem' }} />
        <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_USER">
          {(text) => (
            <UserSelection
              filterUserId={userId}
              placeholder={text as unknown as string}
              onSelect={handleUserPick}
            />
          )}
        </FormattedMessage>
        <UserToUserValidator
          value={selectedAmount}
          userId={userId}
          targetUserId={selectedUser.id}
          render={(isValid) => (
            <FormattedMessage id="USER_TRANSACTION_CREATE_SUBMIT_TITLE">
              {(text) => (
                <AcceptButton
                  type="submit"
                  disabled={!(isValid && selectedUser.id) || isPending}
                  title={text as unknown as string}
                />
              )}
            </FormattedMessage>
          )}
        />
      </div>
      <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_COMMENT">
        {(text) => (
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={text as unknown as string}
          />
        )}
      </FormattedMessage>
    </form>
  );
}

// Existing routers reference the wrapped name; the function component uses
// hooks directly so the wrapper is now an identity re-export.
export const ConnectedCreateCustomTransactionForm = CreateUserTransactionForm;
