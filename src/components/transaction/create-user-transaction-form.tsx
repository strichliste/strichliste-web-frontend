import {
  AcceptIcon,
  Card,
  Input,
  PrimaryButton,
  ResponsiveGrid,
  styled,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { User, startCreatingTransaction } from '../../store/reducers';
import { Currency, CurrencyInput } from '../currency';
import { UserSelection } from '../user';
import { UserName } from '../user/user-name';
import { TransactionUndoButton } from './transaction-undo-button';
import { UserToUserValidator } from './user-to-user-validator';
import { store } from '../../store';

export const AcceptWrapper = withTheme(
  styled('div')({}, props => ({
    svg: {
      marginRight: '2rem',
      fill: props.theme.green,
    },
  }))
);

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
};

interface State {
  amount: number;
  createdTransactionId: number;
  hasSelectionReady: boolean;
  selectedAmount: number;
  selectedUser: User;
  comment: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = RouteComponentProps<{ id: string }> & { intl: any };

export class CreateUserTransactionForm extends React.Component<Props, State> {
  public state = initialState;
  public submitUserId = (user: User): void => {
    if (!user) return;

    if (!this.state.selectedUser.id) {
      this.setState(() => ({ selectedUser: user }));
    } else {
      this.handleSubmit();
    }
  };

  public createTransaction = async () => {
    if (this.state.selectedUser.id && this.state.selectedAmount) {
      const res = await startCreatingTransaction(
        store.dispatch,
        this.props.match.params.id,
        {
          amount: this.state.selectedAmount * -1,
          recipientId: this.state.selectedUser.id,
          comment: this.state.comment,
        }
      );
      if (res && res.id) {
        this.setState({
          hasSelectionReady: true,
          createdTransactionId: res.id,
        });
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

  public render(): JSX.Element {
    if (this.state.hasSelectionReady) {
      return (
        <Card width="100%" margin="1rem 0" flex justifyContent="space-between">
          <AcceptWrapper>
            <AcceptIcon />
            <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_SUCCESS" />{' '}
            <UserName width="120px" name={this.state.selectedUser.name} />
            &#8594;
            <Currency value={this.state.selectedAmount} />
          </AcceptWrapper>
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
            <ResponsiveGrid
              margin="1rem 0"
              gridGap="1rem"
              alignItems="center"
              tabletColumns="4fr 1fr 4fr 1fr"
            >
              <FormattedMessage
                defaultMessage="Amount"
                id="USER_TRANSACTION_FROM_AMOUNT_LABEL"
              >
                {text => (
                  <CurrencyInput
                    noNegative
                    placeholder={text as string}
                    autoFocus
                    onChange={value =>
                      this.setState({
                        selectedAmount: value,
                      })
                    }
                  />
                )}
              </FormattedMessage>
              &#8594;
              <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_USER">
                {text => (
                  <UserSelection
                    userId={this.props.match.params.id}
                    placeholder={text as string}
                    onSelect={this.submitUserId}
                  />
                )}
              </FormattedMessage>
              <UserToUserValidator
                value={this.state.selectedAmount}
                userId={this.props.match.params.id}
                targetUserId={this.state.selectedUser.id}
                render={isValid => (
                  <PrimaryButton isRound disabled={!isValid} type="submit">
                    <AcceptIcon />
                  </PrimaryButton>
                )}
              />
            </ResponsiveGrid>
            <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_COMMENT">
              {text => (
                <Input
                  value={this.state.comment}
                  onChange={this.setComment}
                  placeholder={text as string}
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
