import * as React from 'react';
import { connect } from 'react-redux';

import { Button, ResponsiveGrid, theme } from 'bricks-of-sand';
import { AppState, Dispatch } from '../../store';
import {
  Boundary,
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { ConnectedTransactionValidator } from './validator';

interface OwnProps {
  userId: number;
  transactionCreated?(): void;
}

interface MapStateProps {
  boundary: Boundary;
}

interface StateProps {
  value: number;
}

interface ActionProps {
  createTransaction(
    userId: number,
    params: CreateTransactionParams
  ): // tslint:disable-next-line:no-any
  Promise<any>;
}

type Props = ActionProps & OwnProps & MapStateProps;

export class CreateCustomTransactionForm extends React.Component<
  Props,
  StateProps
> {
  public state = { value: 0 };

  public handleChange = (value: number) => {
    this.setState({ value });
  };

  public submit = async (isDeposit: boolean) => {
    const { createTransaction, userId, transactionCreated } = this.props;
    const multiplier = isDeposit ? 1 : -1;
    const amount = this.state.value * multiplier;

    const result = await createTransaction(userId, { amount });

    if (transactionCreated) {
      transactionCreated();
    }

    if (result) {
      this.setState({ value: 0 });
    }
  };

  public render(): JSX.Element {
    const { userId, boundary } = this.props;
    return (
      <ResponsiveGrid columns="1fr 4fr 1fr">
        <ConnectedTransactionValidator
          userId={userId}
          boundary={boundary}
          value={this.state.value}
          isDeposit={false}
          render={isValid => (
            <Button
              background={theme.red}
              onClick={() => this.submit(false)}
              isRound
              disabled={!isValid}
              type="submit"
            >
              -
            </Button>
          )}
        />
        <CurrencyInput
          value={this.state.value}
          placeholder="CUSTOM AMOUNT"
          onChange={this.handleChange}
        />
        <ConnectedTransactionValidator
          userId={userId}
          boundary={boundary}
          value={this.state.value}
          isDeposit={true}
          render={isValid => (
            <Button
              background={theme.green}
              onClick={() => this.submit(true)}
              isRound
              disabled={!isValid}
              type="submit"
            >
              +
            </Button>
          )}
        />
      </ResponsiveGrid>
    );
  }
}

const mapStateToProps = (state: AppState): MapStateProps => ({
  boundary: state.settings.payment.boundary,
});

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => ({
  createTransaction: (userId: number, params: CreateTransactionParams) =>
    dispatch(startCreatingTransaction(userId, params)),
});

export const ConnectedCreateCustomTransactionForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCustomTransactionForm);
