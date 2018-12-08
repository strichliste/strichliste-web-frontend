import {
  AcceptIcon,
  Card,
  PrimaryButton,
  ResponsiveGrid,
  withTheme,
} from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage, InjectedIntl, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { User, startCreatingTransaction } from '../../store/reducers';
import { Currency, CurrencyInput } from '../currency';
import { AddIcon } from '../ui/icons/add';
import { ConnectedUserSelectionList } from '../user';
import { ConnectedTransactionUndoButton } from './transaction-undo-button';
import { ConnectedUserToUserValidator } from './user-to-user-validator';

const AcceptWrapper = withTheme(
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
    id: 0,
    name: '',
    isActive: false,
    balance: 0,
    created: '',
    transactions: {},
  },
  amount: 0,
  createdTransactionId: 0,
};

interface ActionProps {
  // tslint:disable-next-line:no-any
  startCreatingTransaction: any;
}

interface State {
  amount: number;
  createdTransactionId: number;
  hasSelectionReady: boolean;
  selectedAmount: number;
  selectedUser: User;
}

type Props = RouteComponentProps<{ id: string }> &
  ActionProps & { intl: InjectedIntl };

export class CreateUserTransactionForm extends React.Component<Props, State> {
  public state = initialState;

  public submitUserId = (user: User): void => {
    this.setState(() => ({ selectedUser: user }));
  };

  public createTransaction = async () => {
    if (this.state.selectedUser.id && this.state.selectedAmount) {
      const res = await this.props.startCreatingTransaction(
        Number(this.props.match.params.id),
        {
          amount: this.state.selectedAmount * -1,
          recipientId: this.state.selectedUser.id,
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

  public render(): JSX.Element {
    if (this.state.hasSelectionReady) {
      return (
        <Card margin="1rem 0" flex justifyContent="space-between">
          <AcceptWrapper>
            <AcceptIcon />
            <FormattedMessage id="CREATE_USER_TO_USER_TRANSACTION_SUCCESS" />{' '}
            {this.state.selectedUser.name} &#8594;
            <Currency value={this.state.selectedAmount} />
          </AcceptWrapper>
          <ConnectedTransactionUndoButton
            onSuccess={() =>
              this.setState({
                hasSelectionReady: false,
              })
            }
            transactionId={this.state.createdTransactionId}
            userId={Number(this.props.match.params.id)}
          />
        </Card>
      );
    } else {
      return (
        <ResponsiveGrid
          margin="1rem 0"
          gridGap="1rem"
          alignItems="center"
          tabletColumns="4fr 1fr 4fr 1fr"
        >
          <CurrencyInput
            placeholder={this.props.intl.formatMessage({
              id: 'SEND_MOONEY_TO_A_FRIEND_INPUT',
              defaultMessage: 'AMOUNT',
            })}
            autoFocus
            onChange={value =>
              this.setState({
                selectedAmount: value,
              })
            }
          />
          &#8594;
          <ConnectedUserSelectionList
            placeholder={this.props.intl.formatMessage({
              id: 'CREATE_USER_TO_USER_TRANSACTION_USER',
              defaultMessage: 'Username',
            })}
            getString={user => user.name}
            onSelect={this.submitUserId}
          />
          <ConnectedUserToUserValidator
            value={this.state.selectedAmount}
            userId={Number(this.props.match.params.id)}
            targetUserId={this.state.selectedUser.id}
            render={isValid => (
              <PrimaryButton
                disabled={!isValid}
                onClick={this.createTransaction}
                isRound
              >
                <AddIcon />
              </PrimaryButton>
            )}
          />
        </ResponsiveGrid>
      );
    }
  }
}

const mapDispatchToProps = {
  startCreatingTransaction,
};

export const ConnectedCreateUserTransactionForm = injectIntl(
  withRouter(
    connect(
      undefined,
      mapDispatchToProps
    )(CreateUserTransactionForm)
  )
);
