import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState, Dispatch } from '../../store';
import {
  getUserTransactionsArray,
  startLoadingTransactions,
} from '../../store/reducers';
import { Button } from '../ui';
import { ConnectedTransactionListItem } from './transaction-list-item';

interface OwnProps {
  userId: number;
}

interface StateProps {
  transactions: number[];
}

interface ActionProps {
  loadTransactions(
    userId: number,
    offset?: number,
    limit?: number
  ): Promise<void>;
}

export type TransactionTableProps = ActionProps & StateProps & OwnProps;

interface State {
  limit: number;
  offset: number;
}

export class TransactionTable extends React.Component<
  TransactionTableProps,
  State
> {
  public state = {
    offset: 0,
    limit: 15,
  };

  public componentDidMount(): void {
    this.loadMoreRows();
  }

  public loadMoreRows = async (): Promise<void> => {
    this.setState(state => ({
      offset: state.offset + state.limit,
    }));
    const { limit, offset } = this.state;
    await this.props.loadTransactions(this.props.userId, offset, limit);
  };

  public render(): JSX.Element {
    return (
      <>
        {this.props.transactions.map(id => (
          <ConnectedTransactionListItem key={id} id={id} />
        ))}
        <Button onClick={this.loadMoreRows}>
          <FormattedMessage id="USER_TRANSACTIONS_TABLE_LOAD_NEXT_ROWS" />
        </Button>
      </>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  transactions: getUserTransactionsArray(state, props.userId),
});

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => ({
  loadTransactions: (id: number, offset: number, limit: number) =>
    dispatch(startLoadingTransactions(id, offset, limit)),
});

export const ConnectedTransactionTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionTable);
