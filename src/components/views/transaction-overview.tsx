import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BackButton } from '../common';
import { ConnectedTransactionTable } from '../transaction/transaction-table';
import { Card, FixedFooter, Section } from '../ui';

export type TransactionOverviewProps = RouteComponentProps<{ id: number }>;

export function TransactionOverview(
  props: TransactionOverviewProps
): JSX.Element {
  return (
    <>
      <Section>
        <Card>
          <ConnectedTransactionTable userId={props.match.params.id} />
        </Card>
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
