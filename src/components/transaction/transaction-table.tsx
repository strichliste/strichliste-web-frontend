import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '../../store';
import {
  Transaction,
  TransactionsResponse,
  startLoadingTransactions,
} from '../../store/reducers';
import { Pager } from '../common/pager';
import { getUserTransactionsLink } from '../user/user-router';
import { ConnectedTransactionListItem } from './transaction-list-item';

interface OwnProps {
  userId: number;
  page: number;
  onPageChange(url: string): void;
}

interface ActionProps {
  loadTransactions(
    userId: number,
    offset?: number,
    limit?: number
  ): Promise<TransactionsResponse | undefined>;
}

export type TransactionTableProps = ActionProps & OwnProps;

interface State {
  limit: number;
  offset: number;
  itemCount: number;
  transactions: Transaction[];
}

let lastPage = 0;

export class TransactionTable extends React.Component<
  TransactionTableProps,
  State
> {
  public state = {
    limit: 15,
    offset: 0,
    itemCount: 0,
    transactions: [],
  };

  public componentDidMount(): void {
    this.loadRows();
  }

  public componentDidUpdate(): void {
    if (lastPage !== this.props.page) {
      this.loadRows();
      lastPage = this.props.page;
    }
  }

  public next = (nextPage: number) => {
    const url = getUserTransactionsLink(this.props.userId, nextPage);

    this.props.onPageChange(url);
  };

  public getLimitAndOffset = (): { limit: number; offset: number } => {
    const { page } = this.props;
    const limit = this.state.limit;
    const offset = limit * page;

    return { limit, offset };
  };

  public loadRows = async (): Promise<void> => {
    const { limit, offset } = this.getLimitAndOffset();
    const res = await this.props.loadTransactions(
      this.props.userId,
      offset,
      limit
    );
    if (res && res.transactions && res.count) {
      this.setState({ transactions: res.transactions, itemCount: res.count });
    }
  };

  public render(): JSX.Element {
    return (
      <>
        <Pager
          itemCount={this.state.itemCount}
          currentPage={this.props.page}
          limit={this.state.limit}
          onChange={this.next}
        />
        <TransactionPage transactions={this.state.transactions} />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => ({
  loadTransactions: (id: number, offset: number, limit: number) =>
    startLoadingTransactions(dispatch, id, offset, limit),
});

export const ConnectedTransactionTable = connect(
  undefined,
  mapDispatchToProps
)(TransactionTable);

function TransactionPage(props: { transactions: Transaction[] }): JSX.Element {
  return (
    <>
      {props.transactions.map(transaction => (
        <ConnectedTransactionListItem
          key={transaction.id}
          id={transaction.id}
        />
      ))}
    </>
  );
}
