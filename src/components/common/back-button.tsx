import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';

import { Button } from '../ui';

function NavButton(props: RouteComponentProps<{}>): JSX.Element | null {
  const cantGoBack = props.history.length === 0;
  if (cantGoBack) {
    return null;
  }

  return (
    <Button onClick={() => props.history.goBack()}>
      <FormattedMessage id="BACK_BUTTON" />
    </Button>
  );
}

export const BackButton = withRouter(NavButton);
