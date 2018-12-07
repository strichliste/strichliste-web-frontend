import * as React from 'react';

import { withRouter } from 'react-router';
import { UserRouteProps, getUserDetailLink } from '../user/user-router';

import { Separator } from 'bricks-of-sand';

// tslint:disable-next-line:no-any
const Component = (props: UserRouteProps): any => {
  const id = props.match.params.id;
  const pathname = getUserDetailLink(Number(id));

  return pathname === props.history.location.pathname ? null : (
    <Separator margin="2rem 0 0 0" padding="2rem 0 0 0" />
  );
};

export const UserDetailsSeparator = withRouter(Component);
