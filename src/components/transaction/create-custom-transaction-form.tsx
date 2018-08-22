import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { DefaultThunkAction } from '../../store';
import {
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { Button, theme } from '../ui';

interface OwnProps {
  isDeposit: boolean;
  userId: number;
}

interface StateProps {
  value: number;
}

interface ActionProps {
  createTransaction(
    userId: number,
    params: CreateTransactionParams
  ): DefaultThunkAction;
}

type Props = ActionProps & OwnProps;

export class CreateCustomTransactionForm extends React.Component<
  Props,
  StateProps
> {
  public state = { value: 0 };

  public handleChange = (value: number) => {
    this.setState({ value });
  };

  public submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { createTransaction, userId, isDeposit } = this.props;
    const multiplier = isDeposit ? 1 : -1;
    const amount = this.state.value * multiplier;

    createTransaction(userId, {
      amount,
    });
  };

  public render(): JSX.Element {
    const { isDeposit } = this.props;
    return (
      <form onSubmit={this.submit}>
        <CurrencyInput placeholder="0" onChange={this.handleChange} />
        <Button color={isDeposit ? theme.green : theme.red} type="submit">
          <FormattedMessage
            id={
              isDeposit
                ? 'USER_TRANSACTION_CREATE_CUSTOM_DEPOSIT_BUTTON'
                : 'USER_TRANSACTION_CREATE_CUSTOM_DISPENSE_BUTTON'
            }
          />
        </Button>
      </form>
    );
  }
}

const mapStateToProps = undefined;

const mapDispatchToProps = {
  createTransaction: startCreatingTransaction,
};

export const ConnectedCreateCustomTransactionForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCustomTransactionForm);
