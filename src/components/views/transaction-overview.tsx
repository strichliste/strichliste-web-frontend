import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BackButton } from '../common';
import { ConnectedTransactionTable } from '../transaction/transaction-table';
import { Card, FixedFooter, Section } from '../ui';

export type TransactionOverviewProps = RouteComponentProps<{
  id: number;
  offset: number;
  limit: number;
}>;

export function TransactionOverview(
  props: TransactionOverviewProps
): JSX.Element {
  const { id, offset, limit } = props.match.params;
  return (
    <>
      <Section>
        <Card>
          <ConnectedTransactionTable
            limit={limit}
            offset={offset}
            userId={id}
          />
        </Card>
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
