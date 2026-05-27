import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from '../../routing';
import { Button } from '../../bricks';

function NavButton(props: RouteComponentProps): React.JSX.Element | null {
  return (
    <Button onClick={() => props.history.goBack()}>
      <FormattedMessage id="BACK_BUTTON" />
    </Button>
  );
}

export const BackButton = withRouter(NavButton);
