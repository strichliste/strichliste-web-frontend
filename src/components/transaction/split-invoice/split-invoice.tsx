import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { store } from '../../../store';
import {
  CreateTransactionParams,
  Transaction,
  User,
  startCreatingTransaction,
} from '../../../store/reducers';
import { WrappedIdleTimer } from '../../common/idle-timer';
import { Currency, CurrencyInput } from '../../currency';
import { UserSelection } from '../../user';
import { UserName } from '../../user/user-name';
import { isTransactionValid } from '../validator';
import {
  AcceptButton,
  Input,
  Separator,
  CancelButton,
  AlertText,
  Button,
  Card,
  AcceptIcon,
} from '../../../bricks';

import styles from './split-invoice.module.css';

type Validation = {
  [userId: string]: string;
};

type Response = {
  [userId: string]: Transaction | 'error';
};

export const SplitInvoiceForm = () => {
  const intl = useIntl();
  const [recipient, setRecipient] = React.useState<User | undefined>(undefined);
  const [participants, setParticipants] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [validation, setValidation] = React.useState<Validation>({});
  const [response, setResponse] = React.useState<Response>({});

  const resetState = () => {
    setRecipient(undefined);
    setParticipants([]);
    setIsLoading(false);
    setAmount(0);
    setComment('');
    setValidation({});
    setResponse({});
  };

  const submitSplitInvoice = async () => {
    participants.forEach(async participant => {
      await createTransaction(participant);
    });
  };

  const createTransaction = async (participant: User) => {
    if (formIsValid() && recipient) {
      setIsLoading(true);
      const userId = participant.id;
      const params = getParams(recipient);
      const result = await startCreatingTransaction(
        store.dispatch,
        userId,
        params
      );
      setResponse(response => ({ ...response, [userId]: result || 'error' }));
    }
  };

  const getParams = (recipient: User): CreateTransactionParams => {
    return {
      comment,
      recipientId: recipient.id,
      amount: getSplitAmount() * -1,
    };
  };

  React.useEffect(() => {
    updateValidation();
  }, [participants, amount, recipient]);

  const addParticipant = (user: User) => {
    setParticipants([...participants, user]);
  };

  const removeParticipant = (userToRemove: User) => {
    setParticipants(participants.filter(user => user.id !== userToRemove.id));
  };

  const getSplitAmount = () => {
    const result = amount / getLengthOfParticipantsAndRecipient();
    return isNaN(result) ? 0 : result;
  };

  const getLengthOfParticipantsAndRecipient = () => {
    return participants.length + (recipient ? 1 : 0);
  };

  const submitIsValid = () => {
    return showNotification() && formIsValid();
  };

  const filterUsers = recipient ? [...participants, recipient] : participants;

  const updateValidation = () => {
    const value = getSplitAmount();
    const accountBoundary = store.getState().settings.account.boundary;
    const paymentBoundary = store.getState().settings.payment.boundary;
    const initialValue: { [key: number]: string } = {};
    const validation = Object.values(participants).reduce(
      (acc, participant) => {
        return {
          ...acc,
          [participant.id]: isTransactionValid({
            value,
            isDeposit: false,
            accountBoundary,
            paymentBoundary,
            balance: participant.balance,
          })
            ? ''
            : `can't afford it`,
        };
      },
      initialValue
    );

    setValidation(validation);
  };

  const formIsValid = () => {
    return Object.values(validation).every(item => item === '');
  };

  const showNotification = () => {
    return !!(amount > 0 && participants.length && recipient);
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        {Object.keys(response).length === 0 && (
          <div>
            <FormattedMessage
              id="SPLIT_INVOICE_LOADING"
              defaultMessage="creating transactions"
            />
          </div>
        )}
        {Object.keys(response).map(userId => {
          const item = response[userId];
          const user = participants.find(user => user.id == userId);
          const userName = user ? user.name : '';

          if (item === 'error') {
            return (
              <Card key={userId} error>
                <FormattedMessage
                  id="SPLIT_INVOICE_ERROR_MESSAGE"
                  defaultMessage="Failed to create Transaction for"
                />{' '}
                <UserName name={userName} />
              </Card>
            );
          }
          return (
            <Card margin="1rem 0" key={userId}>
              <AcceptIcon />

              <UserName name={userName} />
              <p>
                <FormattedMessage
                  id="SPLIT_INVOICE_SUCCESS_MESSAGE"
                  defaultMessage="payed the money"
                />
              </p>
            </Card>
          );
        })}
        <Button primary onClick={resetState}>
          <FormattedMessage
            id="reset form"
            defaultMessage="split another invoice"
          />
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <WrappedIdleTimer />
      <h1>
        <FormattedMessage id="SPLIT_INVOICE_HEADLINE" />
      </h1>

      <div className={styles.grid}>
        <CurrencyInput
          placeholder={intl.formatMessage({
            id: 'USER_TRANSACTIONS_TABLE_AMOUNT',
          })}
          value={amount}
          onChange={setAmount}
        />
        <div style={{ textAlign: 'center' }}>
          <FormattedMessage id="WITH" defaultMessage="with" />
        </div>

        <UserSelection
          filterUsers={filterUsers}
          onSelect={setRecipient}
          placeholder={intl.formatMessage({ id: 'SELECT_RECIPIENT' })}
        />
      </div>
      <Input
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={intl.formatMessage({
          id: 'USER_TRANSACTIONS_TABLE_COMMENT',
        })}
      />
      <div style={{ margin: '1rem 0', textAlign: 'center' }}>
        <FormattedMessage id="AND" defaultMessage="and" />
      </div>
      <div>
        <div>
          {participants.map(user => (
            <div style={{ margin: '0.25rem 0' }} key={user.id}>
              <CancelButton
                onClick={() => removeParticipant(user)}
                style={{ marginRight: '1rem' }}
              />
              <UserSelection
                user={user}
                filterUsers={filterUsers}
                onSelect={addParticipant}
                placeholder="add participant"
              />
              {validation[user.id] && (
                <AlertText value={-1}>
                  <FormattedMessage
                    id="CANT_AFFORD"
                    defaultMessage="can't afford it"
                  />
                </AlertText>
              )}
            </div>
          ))}
        </div>
        <div>
          <UserSelection
            key={participants.length}
            filterUsers={filterUsers}
            onSelect={addParticipant}
            placeholder="add participant"
          />
        </div>
      </div>
      {showNotification() && (
        <>
          <Separator margin="2rem 0" />
          <div style={{ textAlign: 'center' }}>
            <p>
              {getLengthOfParticipantsAndRecipient()}{' '}
              <FormattedMessage
                id="PARTICIPANTS"
                defaultMessage="participants"
              />{' '}
              <FormattedMessage id="SPLIT" defaultMessage="split" />{' '}
              <Currency value={amount} />
            </p>
            <div>
              <FormattedMessage
                id="SPLIT_PAY_MESSAGE"
                defaultMessage="everybody has to pay"
              />{' '}
              <Currency value={getSplitAmount()} />
              {recipient && (
                <>
                  <FormattedMessage
                    id="SPLIT_INVOICE_RECIPIENT_NOTE"
                    defaultMessage=" to "
                  />
                  <UserName name={recipient.name} />
                </>
              )}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <AcceptButton
                title={intl.formatMessage({ id: 'SPLIT_INVOICE_SUBMIT' })}
                onClick={submitSplitInvoice}
                disabled={!submitIsValid()}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
