import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { ConnectedTransactionTable } from '../../transaction/transaction-table';
import { Button, Card, FixedFooter, Section, theme } from '../../ui';

export type TransactionOverviewProps = RouteComponentProps<{
  id: string;
  page: string;
}>;

export function TransactionOverview(
  props: TransactionOverviewProps
): JSX.Element {
  const { id, page } = props.match.params;
  return (
    <>
      <Section>
        <Card>
          <ConnectedTransactionTable
            onPageChange={url => props.history.push(url)}
            page={Number(page)}
            userId={Number(id)}
          />
        </Card>
      </Section>
      <FixedFooter>
        <Button color={theme.primary} onClick={() => props.history.push(``)}>
          <FormattedMessage id="BACK_BUTTON" />
        </Button>
      </FixedFooter>
    </>
  );
}
