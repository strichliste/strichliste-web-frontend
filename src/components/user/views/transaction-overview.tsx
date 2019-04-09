import { Block } from 'bricks-of-sand';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TransactionTable } from '../../transaction/transaction-table';
import { ScrollToTop } from '../../common/scroll-to-top';

export type TransactionOverviewProps = RouteComponentProps<{
  id: string;
  page: string;
}>;

export function TransactionOverview(
  props: TransactionOverviewProps
): JSX.Element {
  const { id, page } = props.match.params;
  return (
    <Block margin="1rem">
      <ScrollToTop />

      <TransactionTable
        onPageChange={url => props.history.push(url)}
        page={Number(page)}
        userId={id}
      />
    </Block>
  );
}
