import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from '../../store';
import {
  Transaction,
  TransactionsResponse,
  startLoadingTransactions,
} from '../../store/reducers';
import { Button } from '../ui';
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

  public next = () => {
    const next = this.props.page + 1;
    const url = `/user/${this.props.userId}/transactions/${next}`;

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
    if (res && res.transactions) {
      this.setState({ transactions: res.transactions });
    }
  };

  public render(): JSX.Element {
    return (
      <>
        <Button onClick={this.next}>
          <FormattedMessage id="USER_TRANSACTIONS_TABLE_LOAD_NEXT_ROWS" />
        </Button>
        <TransactionPage transactions={this.state.transactions} />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => ({
  loadTransactions: (id: number, offset: number, limit: number) =>
    dispatch(startLoadingTransactions(id, offset, limit)),
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
