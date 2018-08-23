import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { AppState, Dispatch } from '../../store';
import {
  Boundary,
  CreateTransactionParams,
  startCreatingTransaction,
} from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { Button, FormField, theme } from '../ui';
import { ConnectedTransactionValidator } from './validator';

interface OwnProps {
  isDeposit: boolean;
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
  ): Promise<void>;
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

  public submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      createTransaction,
      userId,
      isDeposit,
      transactionCreated,
    } = this.props;
    const multiplier = isDeposit ? 1 : -1;
    const amount = this.state.value * multiplier;

    await createTransaction(userId, {
      amount,
    });

    if (transactionCreated) {
      transactionCreated();
    }
  };

  public render(): JSX.Element {
    const { isDeposit, userId, boundary } = this.props;
    return (
      <form onSubmit={this.submit}>
        <FormField>
          <CurrencyInput placeholder="0" onChange={this.handleChange} />
        </FormField>
        <FormField>
          <ConnectedTransactionValidator
            userId={userId}
            boundary={boundary}
            value={this.state.value}
            isDeposit={true}
            render={isValid => (
              <Button
                disabled={!isValid}
                color={isDeposit ? theme.green : theme.red}
                type="submit"
              >
                <FormattedMessage
                  id={
                    isDeposit
                      ? 'USER_TRANSACTION_CREATE_CUSTOM_DEPOSIT_BUTTON'
                      : 'USER_TRANSACTION_CREATE_CUSTOM_DISPENSE_BUTTON'
                  }
                />
              </Button>
            )}
          />
        </FormField>
      </form>
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
