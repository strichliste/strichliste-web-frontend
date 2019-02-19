import {
  AcceptButton,
  Block,
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
  UsersState,
  startCreatingTransaction,
} from '../../../store/reducers';
import { ConnectedIdleTimer } from '../../common/idle-timer';
import { Currency, CurrencyInput } from '../../currency';
import { AcceptIcon } from '../../ui/icons/accept';
import { UserSelection } from '../../user';
import { UserMultiSelection } from '../../user/user-multi-selection';
import { UserName } from '../../user/user-name';
import { isTransactionValid } from '../validator';

interface State {
  isLoading: boolean;
  recipient: User | undefined;
  participants: User[];
  comment: string;
  amount: number;
  responseState: { [userId: number]: Transaction | 'error' };
  validation: { [userId: number]: string };
}

interface Props {}

const initialState: State = {
  isLoading: false,
  recipient: undefined,
  participants: [],
  comment: '',
  amount: 0,
  responseState: {},
  validation: {},
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

const TextCenter = styled(Block)({
  textAlign: 'center',
});

export class SplitInvoiceForm extends React.Component<Props, State> {
  public state = initialState;

  public resetState = () => {
    this.setState(initialState);
  };

  public submitSplitInvoice = async () => {
    this.state.participants.forEach(async participant => {
      await this.createTransaction(participant);
    });
  };

  public createTransaction = async (participant: User) => {
    if (this.formIsValid() && this.state.recipient) {
      this.setState({ isLoading: true });
      const userId = participant.id;
      const params = this.getParams(this.state.recipient);
      const result = await startCreatingTransaction(
        store.dispatch,
        userId,
        params
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
    this.setState({ amount }, this.updateValidation);
  };

  public setComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ comment: e.target.value });
  };

  public addParticipant = (user: UsersState) => {
    this.setState(
      {
        participants: Object.values(user),
      },
      this.updateValidation
    );
  };

  public removeParticipant = (userToRemove: User) => {
    this.setState(
      state => ({
        participants: [
          ...state.participants.filter(user => user.name !== userToRemove.name),
        ],
      }),
      this.updateValidation
    );
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
    return this.showNotification() && this.formIsValid();
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

  public updateValidation = () => {
    const value = this.getSplitAmount();
    const accountBoundary = store.getState().settings.account.boundary;
    const paymentBoundary = store.getState().settings.payment.boundary;
    const initialValue: { [key: number]: string } = {};
    const validation = Object.values(this.state.participants).reduce(
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

    this.setState({ validation });
  };

  public formIsValid = () => {
    return Object.values(this.state.validation).every(item => item === '');
  };

  public showNotification = () => {
    return !!(
      this.state.amount > 0 &&
      this.state.participants.length &&
      this.state.recipient
    );
  };

  public render(): JSX.Element {
    if (this.state.isLoading) {
      return (
        <GridContainer>
          {Object.keys(this.state.responseState).length === 0 && (
            <div>
              <FormattedMessage
                id="SPLIT_INVOICE_LOADING"
                defaultMessage="creating transactions"
              />
            </div>
          )}
          {Object.keys(this.state.responseState).map(userId => {
            const item = this.state.responseState[userId];
            const user = this.state.participants.find(
              user => user.id === Number(userId)
            );
            const userName = user ? user.name : '';

            if (item === 'error') {
              return (
                <Block margin="1rem 0" key={userId}>
                  <FormattedMessage
                    id="SPLIT_INVOICE_ERROR_MESSAGE"
                    defaultMessage="Failed to create Transaction for"
                  />{' '}
                  <UserName name={userName} />
                </Block>
              );
            }
            return (
              <Block margin="1rem 0" key={userId}>
                <AcceptIcon />
                <UserName name={userName} />
                <p>
                  <FormattedMessage
                    id="SPLIT_INVOICE_SUCCESS_MESSAGE"
                    defaultMessage="payed the money"
                  />
                </p>
              </Block>
            );
          })}
          <AcceptButton onClick={this.resetState} />
        </GridContainer>
      );
    }

    return (
      <GridContainer>
        <ConnectedIdleTimer />
        <TextCenter margin="3rem">
          <h1>
            <FormattedMessage
              id="SPLIT_INVOICE_HEADLINE"
              defaultMessage="Split Invoice"
            />
          </h1>
        </TextCenter>

        <ResponsiveGrid
          margin="0 0 1rem 0"
          gridGap="1rem"
          columns="2fr 1fr 2fr"
        >
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
          <TextCenter>
            <FormattedMessage id="WITH" defaultMessage="with" />
          </TextCenter>
          <FormattedMessage
            id="SELECT_RECIPIENT"
            defaultMessage="select recipient"
            children={placeholder => (
              <UserSelection
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
        <TextCenter margin="1rem 0">
          <FormattedMessage id="AND" defaultMessage="and" />
        </TextCenter>
        <Block margin="1rem 0">
          <UserMultiSelection
            excludeUserId={this.state.recipient ? this.state.recipient.id : 0}
            validation={this.state.validation}
            onSelect={this.addParticipant}
            placeholder="add participant"
          />
        </Block>
        {this.showNotification() && (
          <>
            <Separator margin="2rem 0" />
            <NotificationContainer>
              <P>
                {this.getLengthOfParticipantsAndRecipient()}{' '}
                <FormattedMessage
                  id="PARTICIPANTS"
                  defaultMessage="participants"
                />{' '}
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
                  <>
                    <FormattedMessage
                      id="SPLIT_INVOICE_RECIPIENT_NOTE"
                      defaultMessage=" to "
                    />
                    <UserName name={this.state.recipient.name} />
                  </>
                )}
              </P>
              <PrimaryButton
                isRound
                onClick={this.submitSplitInvoice}
                disabled={!this.submitIsValid()}
              >
                <AcceptIcon />
              </PrimaryButton>
            </NotificationContainer>
          </>
        )}
      </GridContainer>
    );
  }
}
