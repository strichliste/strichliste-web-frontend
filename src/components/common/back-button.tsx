import { Button, theme } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';

function NavButton(props: RouteComponentProps): JSX.Element | null {
  return (
    <Button color={theme.primary} onClick={() => props.history.goBack()}>
      <FormattedMessage id="BACK_BUTTON" />
    </Button>
  );
}

export const BackButton = withRouter(NavButton);
