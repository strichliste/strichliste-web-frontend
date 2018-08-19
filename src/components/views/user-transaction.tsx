import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

export function UserTransaction(): JSX.Element {
  return (
    <div>
      <FormattedMessage id="USER_TRANSACTION_CREATE" />
    </div>
  );
}

export const ConnectedUserTransaction = connect()(UserTransaction);
