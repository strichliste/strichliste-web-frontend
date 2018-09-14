import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BackButton } from '../common';
import { ConnectedTransactionTable } from '../transaction/transaction-table';
import { Card, FixedFooter, Section } from '../ui';

export type TransactionOverviewProps = RouteComponentProps<{
  id: string;
  offset: string;
  limit: string;
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
            limit={Number(limit)}
            offset={Number(offset)}
            userId={Number(id)}
          />
        </Card>
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
