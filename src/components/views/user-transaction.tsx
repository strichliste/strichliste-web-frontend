import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { BackButton } from '../common';
import { ConnectedCreateUserTransactionForm } from '../transaction';
import { FixedFooter, Section } from '../ui';

export function UserTransaction(): JSX.Element {
  return (
    <>
      <Section>
        <FormattedMessage id="USER_TRANSACTION_CREATE" />
        <ConnectedCreateUserTransactionForm />
      </Section>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}

export const ConnectedUserTransaction = connect()(UserTransaction);
