import * as React from 'react';
import { UserEditForm } from '../edit-user-form';
import { UserRouteProps, getUserDetailLink } from '../user-router';

function navigateToUserDetails(props: UserRouteProps, id: string): void {
  props.history.push(getUserDetailLink(Number(id)));
}
function navigateHome(props: UserRouteProps): void {
  props.history.push('/user/active');
}

export function UserEditView(props: UserRouteProps): JSX.Element {
  const id = props.match.params.id;
  return (
    <UserEditForm
      onCancel={() => navigateToUserDetails(props, id)}
      onSave={() => navigateToUserDetails(props, id)}
      onDisabled={() => navigateHome(props)}
      userId={Number(id)}
    />
  );
}
