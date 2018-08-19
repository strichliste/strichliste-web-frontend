import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { DefaultThunkAction } from '../../store';
import {
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../store/reducers';
import { Button, MaterialInput, theme } from '../ui';

const initialState = {
  selectedAmount: 0,
  selectedUser: 5,
  amount: 0,
  userId: 0,
};

interface ActionProps {
  startCreatingTransaction(
    userId: number,
    params: CreateTransactionParams
  ): DefaultThunkAction;
}

type State = typeof initialState;

type Props = RouteComponentProps<{ id: string }> & ActionProps;

export class CreateUserTransactionForm extends React.Component<Props, State> {
  public state = initialState;

  public submitAmount = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    this.setState(state => ({
      selectedAmount: state.amount,
    }));
  };

  public submitUserId = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    this.setState(state => ({ selectedUser: state.userId }));
  };

  public createTransaction = () => {
    console.log(this.props);

    this.props.startCreatingTransaction(Number(this.props.match.params.id), {
      amount: this.state.selectedAmount,
      recipientId: this.state.selectedUser,
    });
  };

  public render(): JSX.Element {
    return (
      <>
        <form onSubmit={e => this.submitAmount(e)}>
          <MaterialInput>
            <FormattedMessage
              children={text => (
                <input
                  value={this.state.amount}
                  onChange={e =>
                    this.setState({ amount: Number(e.target.value) })
                  }
                  autoFocus
                  placeholder={text.toString()}
                  type="text"
                />
              )}
              id="USER_TRANSACTION_FROM_AMOUNT_LABEL"
            />
          </MaterialInput>
        </form>

        <form onSubmit={e => this.submitUserId(e)}>
          <MaterialInput>
            <FormattedMessage
              children={text => (
                <input
                  value={this.state.userId}
                  onChange={e =>
                    this.setState({ userId: Number(e.target.value) })
                  }
                  autoFocus
                  placeholder={text.toString()}
                  type="text"
                />
              )}
              id="USER_TRANSACTION_FROM_AMOUNT_LABEL"
            />
          </MaterialInput>
        </form>
        <div>
          <Button onClick={this.createTransaction} color={theme.primary}>
            +
          </Button>
        </div>
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
