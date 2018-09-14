import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
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
  limit: number;
  offset: number;
}

interface StateProps {}

interface ActionProps {
  loadTransactions(
    userId: number,
    offset?: number,
    limit?: number
  ): Promise<TransactionsResponse | undefined>;
}

export type TransactionTableProps = ActionProps &
  StateProps &
  OwnProps &
  RouteComponentProps<{}>;

interface State {
  transactions: Transaction[];
}

let lastOffset = 0;

export class TransactionTable extends React.Component<
  TransactionTableProps,
  State
> {
  public state = {
    transactions: [],
  };

  public componentDidMount(): void {
    this.loadRows();
  }

  public componentDidUpdate(): void {
    if (lastOffset !== this.props.offset) {
      this.loadRows();
      lastOffset = this.props.offset;
    }
  }

  public next = () => {
    const { userId, limit, offset } = this.props;
    const next = Number(offset) + Number(limit);
    this.props.history.push(`/user/${userId}/transactions/${limit}/${next}`);
  };

  public loadRows = async (): Promise<void> => {
    const { limit, offset } = this.props;
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

export const ConnectedTransactionTable = withRouter(
  connect(
    undefined,
    mapDispatchToProps
  )(TransactionTable)
);

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
