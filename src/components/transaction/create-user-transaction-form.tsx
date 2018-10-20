import { Button, MaterialInput, theme } from 'bricks-of-sand';
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
import { Currency, CurrencyInput } from '../currency';
import { ConnectedUserSelectionList } from '../user';
import { ConnectedUserToUserValidator } from './user-to-user-validator';

const initialState = {
  selectedAmount: 0,
  selectedUser: {
    id: 0,
    name: '',
    isActive: false,
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
    this.setState(() => ({ selectedUser: user }));
  };

  public createTransaction = () => {
    if (this.state.selectedUser.id && this.state.selectedAmount) {
      this.props.startCreatingTransaction(Number(this.props.match.params.id), {
        amount: this.state.selectedAmount * -1,
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
              <label>
                <FormattedMessage id="USER_TRANSACTION_FROM_AMOUNT_LABEL" />
              </label>
              <MaterialInput>
                <CurrencyInput
                  onChange={value => this.setState({ amount: value })}
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
              <ConnectedUserToUserValidator
                value={this.state.selectedAmount}
                userId={Number(this.props.match.params.id)}
                targetUserId={this.state.selectedUser.id}
                render={isValid => (
                  <>
                    <div>
                      Give {this.state.selectedUser.name}
                      <Currency value={this.state.selectedAmount} />
                    </div>
                    <div>
                      <Button
                        disabled={!isValid}
                        onClick={this.createTransaction}
                        color={theme.primary}
                      >
                        +
                      </Button>
                    </div>
                  </>
                )}
              />
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
