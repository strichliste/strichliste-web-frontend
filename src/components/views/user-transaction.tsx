import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { BackButton } from '../common';
import { ConnectedCreateUserTransactionForm } from '../transaction';
import { Card, FixedFooter, Section } from '../ui';

export function UserTransaction(): JSX.Element {
  return (
    <Section>
      <Card>
        <FormattedMessage id="USER_TRANSACTION_CREATE" />
        <ConnectedCreateUserTransactionForm />
      </Card>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </Section>
  );
}

export const ConnectedUserTransaction = connect()(UserTransaction);
