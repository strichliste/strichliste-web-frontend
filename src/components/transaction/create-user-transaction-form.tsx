import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { DefaultThunkAction } from '../../store';
import {
  CreateTransactionParams,
  User,
  startCreatingTransaction,
} from '../../store/reducers';
import { Currency } from '../currency';
import { Button, MaterialInput, theme } from '../ui';
import { ConnectedUserSelectionList } from '../user';

const initialState = {
  selectedAmount: 0,
  selectedUser: {
    id: 0,
    name: '',
    active: false,
    balance: 0,
    created: '',
    transactions: {},
  },
  amount: 0,
};

interface ActionProps {
  startCreatingTransaction(
    userId: number,
    params: CreateTransactionParams
  ): DefaultThunkAction;
}

interface State {
  selectedAmount: number;
  amount: number;
  selectedUser: User;
}

type Props = RouteComponentProps<{ id: string }> & ActionProps;

export class CreateUserTransactionForm extends React.Component<Props, State> {
  public state = initialState;

  public submitAmount = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    this.setState(state => ({
      selectedAmount: state.amount,
    }));
  };

  public submitUserId = (user: User): void => {
    console.log('selected user', user);
    this.setState(() => ({ selectedUser: user }));
  };

  public createTransaction = () => {
    if (this.state.selectedUser.id && this.state.selectedAmount) {
      this.props.startCreatingTransaction(Number(this.props.match.params.id), {
        amount: this.state.selectedAmount,
        recipientId: this.state.selectedUser.id,
      });
      this.props.history.goBack();
    }
  };

  public render(): JSX.Element {
    return (
      <>
        {!this.state.selectedUser.name &&
          this.state.selectedAmount === 0 && (
            <form onSubmit={e => this.submitAmount(e)}>
              <MaterialInput>
                <label>
                  <FormattedMessage id="USER_TRANSACTION_FROM_AMOUNT_LABEL" />
                </label>
                <input
                  value={this.state.amount}
                  onChange={e =>
                    this.setState({ amount: castNumber(e.target.value) })
                  }
                  autoFocus
                  type="text"
                />
              </MaterialInput>
            </form>
          )}
        {this.state.selectedAmount > 0 &&
          this.state.selectedUser.name === '' && (
            <ConnectedUserSelectionList
              userId={Number(this.props.match.params.id)}
              onSelect={this.submitUserId}
            />
          )}

        {this.state.selectedUser.name &&
          this.state.selectedAmount && (
            <>
              <div>
                Give {this.state.selectedUser.name}
                <Currency value={this.state.selectedAmount} />
              </div>
              <div>
                <Button onClick={this.createTransaction} color={theme.primary}>
                  +
                </Button>
              </div>
            </>
          )}
      </>
    );
  }
}

const mapDispatchToProps = {
  startCreatingTransaction,
};

export const ConnectedCreateUserTransactionForm = withRouter(
  connect(
    undefined,
    mapDispatchToProps
  )(CreateUserTransactionForm)
);

function castNumber(text: string): number {
  const maybeNumber = Number(text);
  return isNaN(maybeNumber) ? 0 : maybeNumber;
}
