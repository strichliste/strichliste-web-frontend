import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BackButton } from '../common';
import { ConnectedCreateCustomTransactionForm } from '../transaction/create-custom-transaction-form';
import { Card, FixedFooter, Section } from '../ui';

export function CreateCustomTransaction(
  props: RouteComponentProps<{ id: number; deposit: string }>
): JSX.Element {
  return (
    <>
      <Section>
        <Card>
          <ConnectedCreateCustomTransactionForm
            transactionCreated={() => props.history.goBack()}
            isDeposit={props.match.params.deposit === 'deposit'}
            userId={props.match.params.id}
          />
        </Card>
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
