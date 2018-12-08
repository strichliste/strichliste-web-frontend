import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectedCreateUserTransactionForm } from '../../transaction';

export function UserTransaction(): JSX.Element {
  return (
    <>
      <ConnectedCreateUserTransactionForm />
    </>
  );
}

export const ConnectedUserTransaction = connect()(UserTransaction);
