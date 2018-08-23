import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

function TransactionLink(props: RouteComponentProps<{}>): JSX.Element {
  return (
    <Link to={props.match.url + '/send_money_to_a_friend'}>
      <FormattedMessage id="USER_TRANSACTION_CREATE_LINK" />
    </Link>
  );
}

export const CreateUserTransactionLink = withRouter(TransactionLink);
