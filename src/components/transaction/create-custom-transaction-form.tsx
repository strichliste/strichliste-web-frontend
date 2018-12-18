import * as React from 'react';
import { connect } from 'react-redux';

import { GreenButton, RedButton, ResponsiveGrid } from 'bricks-of-sand';
import { AppState, Dispatch } from '../../store';
import {
  Boundary,
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { ConnectedTransactionValidator } from './validator';

export interface OwnProps {
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

// tslint:disable-next-line:no-any
type Props = any;

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
      <ResponsiveGrid gridGap="1rem" columns="3rem 1fr 3rem">
        <ConnectedTransactionValidator
          userId={userId}
          boundary={boundary}
          value={this.state.value}
          isDeposit={false}
          render={isValid => (
            <RedButton
              onClick={() => this.submit(false)}
              isRound
              disabled={!isValid}
              type="submit"
            >
              -
            </RedButton>
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
            <GreenButton
              onClick={() => this.submit(true)}
              isRound
              disabled={!isValid}
              type="submit"
            >
              +
            </GreenButton>
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
