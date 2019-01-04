import {
  AlertText,
  Block,
  CancelButton,
  Card,
  Input,
  PrimaryButton,
  ResponsiveGrid,
  Separator,
  styled,
} from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { store } from '../../../store';
import {
  CreateTransactionParams,
  Transaction,
  User,
  startCreatingTransaction,
} from '../../../store/reducers';
import { ConnectedIdleTimer } from '../../common/idle-timer';
import { Currency, CurrencyInput } from '../../currency';
import { ConnectedUserSelectionList } from '../../user';
import { ConnectedTransactionListItem } from '../transaction-list-item';
import { ConnectedTransactionValidator } from '../validator';

interface State {
  recipient: User | undefined;
  participants: User[];
  comment: string;
  amount: number;
  responseState: { [userId: number]: Transaction | 'error' };
}

interface Props {}

const initialState: State = {
  recipient: undefined,
  participants: [],
  comment: '',
  amount: 0,
  responseState: {},
};

const GridContainer = styled('div')({
  maxWidth: '30em',
  margin: '2rem auto',
  padding: '0 1rem',
});

const P = styled('p')({
  marginBottom: '0.5rem',
});

const NotificationContainer = styled('div')({
  textAlign: 'center',
  marginBottom: '1rem',
});

export class SplitInvoiceForm extends React.Component<Props, State> {
  public state = initialState;

  public submitSplitInvoice = async () => {
    this.state.participants.forEach(async participant => {
      await this.createTransaction(participant);
    });
  };

  public createTransaction = async (participant: User) => {
    if (this.state.recipient) {
      const userId = participant.id;
      const params = this.getParams(this.state.recipient);
      const result = await store.dispatch(
        startCreatingTransaction(userId, params)
      );
      this.setState(state => ({
        responseState: {
          ...state.responseState,
          [userId]: result || 'error',
        },
      }));
    }
  };

  public getParams = (recipient: User): CreateTransactionParams => {
    return {
      comment: this.state.comment,
      recipientId: recipient.id,
      amount: this.getSplitAmount() * -1,
    };
  };

  public setRecipient = (user: User) => {
    this.setState({ recipient: user });
  };

  public setAmount = (amount: number) => {
    this.setState({ amount });
  };

  public setComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ comment: e.target.value });
  };

  public addParticipant = (user: User) => {
    this.setState(state => ({
      participants: [...(state.participants || []), user],
    }));
  };

  public removeParticipant = (userToRemove: User) => {
    this.setState(state => ({
      participants: [
        ...state.participants.filter(user => user.name !== userToRemove.name),
      ],
    }));
  };

  public getRecipientUserId = (recipient?: User) => {
    if (recipient) {
      return recipient.id;
    } else {
      return 0;
    }
  };

  public getSplitAmount = () => {
    const result =
      this.state.amount / this.getLengthOfParticipantsAndRecipient();
    return isNaN(result) ? 0 : result;
  };

  public getLengthOfParticipantsAndRecipient = () => {
    return this.state.participants.length + (this.state.recipient ? 1 : 0);
  };

  public submitIsValid = () => {
    return (
      this.state.recipient &&
      this.state.participants.length &&
      this.state.amount > 0
    );
  };

  public getTransactionId = (participant: User): number => {
    const transaction = this.state.responseState[participant.id];
    if (transaction && transaction !== 'error') {
      return transaction.id;
    } else {
      return 0;
    }
  };

  public hasErrorState = (participant: User): boolean => {
    const transactionState = this.state.responseState[participant.id];
    return transactionState === 'error';
  };

  public render(): JSX.Element {
    return (
      <GridContainer>
        <ConnectedIdleTimer />
        <NotificationContainer>
          <P>
            {this.getLengthOfParticipantsAndRecipient()}{' '}
            <FormattedMessage id="PARTICIPANTS" defaultMessage="participants" />{' '}
            <FormattedMessage id="SPLIT" defaultMessage="split" />{' '}
            <Currency value={this.state.amount} />
          </P>
          <P>
            <FormattedMessage
              id="SPLIT_PAY_MESSAGE"
              defaultMessage="everybody has to pay"
            />{' '}
            <Currency value={this.getSplitAmount()} />
            {this.state.recipient && (
              <FormattedMessage
                id="SPLIT_INVOICE_RECIPIENT_NOTE"
                defaultMessage=" to {name}"
                values={{ name: this.state.recipient.name }}
              />
            )}
          </P>
          <PrimaryButton
            onClick={this.submitSplitInvoice}
            disabled={!this.submitIsValid()}
          >
            <FormattedMessage
              id="SUBMIT_SPLIT_INVOICE"
              defaultMessage="split invoice"
            />
          </PrimaryButton>
        </NotificationContainer>
        <Separator margin="2rem 0" />
        <ResponsiveGrid margin="0 0 1rem 0" gridGap="1rem" columns="1fr 2fr">
          <FormattedMessage
            id="USER_TRANSACTIONS_TABLE_AMOUNT"
            children={placeholder => (
              <CurrencyInput
                placeholder={placeholder as string}
                value={this.state.amount}
                onChange={this.setAmount}
              />
            )}
          />
          <FormattedMessage
            id="SELECT_RECIPIENT"
            defaultMessage="select recipient"
            children={placeholder => (
              <ConnectedUserSelectionList
                placeholder={placeholder as string}
                autoFocus
                onSelect={this.setRecipient}
              />
            )}
          />
        </ResponsiveGrid>
        <FormattedMessage
          id="USER_TRANSACTIONS_TABLE_COMMENT"
          children={placeholder => (
            <Input
              value={this.state.comment}
              onChange={this.setComment}
              placeholder={placeholder as string}
            />
          )}
        />
        <Block margin="1rem 0">
          <ConnectedUserSelectionList
            disabled={!(this.state.amount > 0 && this.state.recipient)}
            userId={this.getRecipientUserId(this.state.recipient)}
            getString={() => ''}
            placeholder="add participant"
            autoFocus
            onSelect={this.addParticipant}
          />
        </Block>

        {this.state.participants.map(participant => (
          <Block margin="0.5rem 0" key={participant.name}>
            {this.getTransactionId(participant) ? (
              <>
                {participant.name}{' '}
                <FormattedMessage id="PAYED" defaultMessage="payed" />
                <ConnectedTransactionListItem
                  id={this.getTransactionId(participant)}
                />
              </>
            ) : (
              <Card
                flex
                justifyContent="space-between"
                alignContent="center"
                alignItems="center"
              >
                {this.hasErrorState(participant) ? (
                  <PrimaryButton
                    onClick={() => this.createTransaction(participant)}
                  >
                    <FormattedMessage id="RETRY" defaultMessage="retry" />
                  </PrimaryButton>
                ) : (
                  <CancelButton
                    onClick={() => this.removeParticipant(participant)}
                  />
                )}
                <ConnectedTransactionValidator
                  userId={participant.id}
                  isDeposit
                  value={this.getSplitAmount()}
                  render={isValid => (
                    <>
                      {!isValid && this.state.amount > 0 && (
                        <FormattedMessage
                          id="SPLIT_INVOICE_USER_INVALID"
                          defaultMessage="You can't afford it"
                        />
                      )}
                    </>
                  )}
                />{' '}
                {participant.name}{' '}
                <AlertText value={participant.balance - this.getSplitAmount()}>
                  <Currency
                    value={participant.balance - this.getSplitAmount()}
                  />
                </AlertText>
              </Card>
            )}
          </Block>
        ))}
        <div />
      </GridContainer>
    );
  }
}
