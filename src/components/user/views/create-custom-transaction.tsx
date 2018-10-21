import { Card } from 'bricks-of-sand';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BackButton } from '../../common';
import { ConnectedCreateCustomTransactionForm } from '../../transaction/create-custom-transaction-form';
import { FixedFooter, Section } from '../../ui';

export function CreateCustomTransaction(
  props: RouteComponentProps<{ id: string; deposit: string }>
): JSX.Element {
  return (
    <>
      <Section>
        <Card>
          <ConnectedCreateCustomTransactionForm
            transactionCreated={() => props.history.goBack()}
            userId={Number(props.match.params.id)}
          />
        </Card>
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
