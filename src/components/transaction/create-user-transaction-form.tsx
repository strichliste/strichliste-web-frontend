import { Button, theme } from 'bricks-of-sand';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { User, startCreatingTransaction } from '../../store/reducers';
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
  // tslint:disable-next-line:no-any
  startCreatingTransaction: any;
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
        <form onSubmit={e => this.submitAmount(e)}>
          <CurrencyInput
            autoFocus
            onChange={value => this.setState({ amount: value })}
          />
        </form>

        <ConnectedUserSelectionList
          userId={Number(this.props.match.params.id)}
          onSelect={this.submitUserId}
        />

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
