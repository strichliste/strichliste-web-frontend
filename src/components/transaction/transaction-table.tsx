import * as React from 'react';
import { useUserTransactions } from '../../queries';
import { Pager } from '../common/pager';
import { getUserTransactionsLink } from '../user/user-router';
import { TransactionListItem } from './transaction-list-item';

interface Props {
  userId: string;
  page: number;
  onPageChange(url: string): void;
}

const LIMIT = 15;

export function TransactionTable({
  userId,
  page,
  onPageChange,
}: Props): React.JSX.Element {
  const { transactions, count } = useUserTransactions(
    userId,
    LIMIT * page,
    LIMIT
  );

  const goToPage = (nextPage: number) =>
    onPageChange(getUserTransactionsLink(userId, nextPage));

  const pager = (
    <Pager
      itemCount={count}
      currentPage={page}
      limit={LIMIT}
      onChange={goToPage}
    />
  );

  return (
    <>
      {pager}
      {transactions.map((transaction, index) => (
        <TransactionListItem

          key={transaction.id}
          transaction={transaction}
        />
      ))}
      {pager}
    </>
  );
}
