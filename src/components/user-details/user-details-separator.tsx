import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getUserDetailLink } from '../user/user-router';
import { Separator } from '../../bricks';

export function UserDetailsSeparator(): React.JSX.Element | null {
  const { id = '' } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  return pathname === getUserDetailLink(id) ? null : (
    <Separator margin="2rem 0 0 0" padding="2rem 0 0 0" />
  );
}
