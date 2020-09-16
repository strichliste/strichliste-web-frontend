import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button } from '../../bricks';

function NavButton(props: RouteComponentProps): JSX.Element | null {
  return (
    <Button onClick={() => props.history.back()}>
      <FormattedMessage id="BACK_BUTTON" />
    </Button>
  );
}

export const BackButton = withRouter(NavButton);
