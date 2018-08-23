import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  getUserTransactionsArray,
  startLoadingTransactions,
} from '../../store/reducers';
import { Button } from '../ui';
import { ConnectedTransactionRowItem } from './transaction-row-item';

interface OwnProps {
  userId: number;
}

interface StateProps {
  transactions: number[];
}

interface ActionProps {
  startLoadingTransactions(
    userId: number,
    _offset?: number,
    _limit?: number
  ): void;
}

export type TransactionTableProps = ActionProps & StateProps & OwnProps;

let offset = 0;
const limit = 15;

function pageToNextPage(
  id: number,
  loadTransactions: (userId: number, _offset?: number, _limit?: number) => void
): void {
  offset += limit;
  loadTransactions(id, offset, limit);
}

export function TransactionTable({
  userId,
  transactions,
  startLoadingTransactions,
}: TransactionTableProps): JSX.Element | null {
  return (
    <>
      <table>
        <tr>
          <th>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_AMOUNT" />
          </th>
          <th>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_SENDER" />
          </th>
          <th>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_RECIPIENT" />
          </th>
          <th>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_CREATED" />
          </th>
          <th>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_ARTICLE" />
          </th>
          <th>
            <FormattedMessage id="USER_TRANSACTIONS_TABLE_COMMENT" />
          </th>
        </tr>
        {transactions.map(id => (
          <ConnectedTransactionRowItem key={id} id={id} />
        ))}
      </table>
      <Button onClick={() => pageToNextPage(userId, startLoadingTransactions)}>
        more
      </Button>
      <div style={{ marginBottom: '2rem' }} />
    </>
  );
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  transactions: getUserTransactionsArray(state, props.userId),
});

const mapDispatchToProps: ActionProps = {
  startLoadingTransactions,
};

export const ConnectedTransactionTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionTable);
