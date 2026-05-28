import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from '../../routing';
import { User } from '../../types';
import { createTransaction } from '../../queries/transactions';
import { Currency, CurrencyInput } from '../currency';
import { UserSelection } from '../user';
import { UserName } from '../user/user-name';
import { TransactionUndoButton } from './transaction-undo-button';
import { UserToUserValidator } from './user-to-user-validator';
import { Card, AcceptIcon, AcceptButton, Input, Arrow } from '../../bricks';

import styles from './create-user-transaction-form.module.css';

const initialState = {
  selectedAmount: 0,
  hasSelectionReady: false,
  selectedUser: {
    id: '',
    name: '',
    isActive: false,
    balance: 0,
    created: '',
    transactions: {},
  },
  amount: 0,
  createdTransactionId: 0,
  comment: '',
  isSubmitting: false,
};

interface State {
  amount: number;
  createdTransactionId: number;
  hasSelectionReady: boolean;
  selectedAmount: number;
  selectedUser: User;
  comment: string;
  isSubmitting: boolean;
}

type Props = RouteComponentProps<{ id: string }>;

export class CreateUserTransactionForm extends React.Component<Props, State> {
  public state = initialState;
  public submitUserId = (user: User): void => {
    if (!this.state.selectedUser.id) {
      this.setState(() => ({ selectedUser: user }));
    }
  };

  public createTransaction = async () => {
    if (this.state.isSubmitting) return;
    if (this.state.selectedUser.id && this.state.selectedAmount) {
      this.setState({ isSubmitting: true });
      try {
        const res = await createTransaction(this.props.match.params.id, {
          amount: this.state.selectedAmount * -1,
          recipientId: this.state.selectedUser.id,
          comment: this.state.comment,
        });
        if (res && res.id) {
          this.setState({
            hasSelectionReady: true,
            createdTransactionId: res.id,
          });
        }
      } finally {
        this.setState({ isSubmitting: false });
      }
    }
  };

  public handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (this.state.selectedUser.id && this.state.selectedAmount) {
      this.createTransaction();
    }
  };

  public setComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ comment: event.target.value });
  };

  public render(): React.JSX.Element {
    if (this.state.hasSelectionReady) {
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
            <UserName width="120px" name={this.state.selectedUser.name} />
            &#8594;
            <Currency value={this.state.selectedAmount} />
          </div>
          <TransactionUndoButton
            onSuccess={() =>
              this.setState({
                hasSelectionReady: false,
              })
            }
            transactionId={this.state.createdTransactionId}
            userId={this.props.match.params.id || ''}
          />
        </Card>
      );
    } else {
      return (
        <>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.grid}>
              <FormattedMessage
                defaultMessage="Amount"
                id="USER_TRANSACTION_FROM_AMOUNT_LABEL"
              >
                {text => (
                  <CurrencyInput
                    noNegative
                    placeholder={text as unknown as string}
                    autoFocus
                    onChange={value =>
                      this.setState({
                        selectedAmount: value,
                      })
                    }
                  />
                )}
              </FormattedMessage>
              <Arrow
                style={{
                  width: ' 1rem',
                  height: '1rem',
                }}
              />
              <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_USER">
                {text => (
                  <UserSelection
                    filterUserId={this.props.match.params.id}
                    placeholder={text as unknown as string}
                    onSelect={this.submitUserId}
                  />
                )}
              </FormattedMessage>
              <UserToUserValidator
                value={this.state.selectedAmount}
                userId={this.props.match.params.id}
                targetUserId={this.state.selectedUser.id}
                render={isValid => (
                  <FormattedMessage id="USER_TRANSACTION_CREATE_SUBMIT_TITLE">
                    {text => (
                      <AcceptButton
                        type="submit"
                        disabled={
                          !(isValid && this.state.selectedUser.id) ||
                          this.state.isSubmitting
                        }
                        title={text as unknown as string}
                      />
                    )}
                  </FormattedMessage>
                )}
              />
            </div>
            <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_COMMENT">
              {text => (
                <Input
                  value={this.state.comment}
                  onChange={this.setComment}
                  placeholder={text as unknown as string}
                />
              )}
            </FormattedMessage>
          </form>
        </>
      );
    }
  }
}

export const ConnectedCreateCustomTransactionForm = withRouter(
  CreateUserTransactionForm
);
