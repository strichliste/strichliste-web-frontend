import { Button, theme } from 'bricks-of-sand';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

export interface CreateCustomTransactionLinkProps extends RouteComponentProps {
  isDeposit: boolean;
}

function Link({
  isDeposit,
  history,
  match,
}: CreateCustomTransactionLinkProps): JSX.Element {
  return (
    <Button
      onClick={() => {
        history.push(match.url + (isDeposit ? '/deposit' : '/dispense'));
      }}
      color={isDeposit ? theme.green : theme.red}
    >
      ?
    </Button>
  );
}

export const CreateCustomTransactionLink = withRouter(Link);
