import * as React from 'react';
import { ConnectedUserEditForm } from '../edit-user-form';
import { UserRouteProps, getUserDetailLink } from '../user-router';

export function UserEditView(props: UserRouteProps): JSX.Element {
  const id = props.match.params.id;
  return (
    <>
      <ConnectedUserEditForm
        onCancel={() => navigateToUserDetails(props, id)}
        onSave={() => navigateToUserDetails(props, id)}
        onDisabled={() => navigateHome(props)}
        userId={Number(id)}
      />
    </>
  );
}
function navigateToUserDetails(props: UserRouteProps, id: string): void {
  props.history.push(getUserDetailLink(Number(id)));
}
function navigateHome(props: UserRouteProps): void {
  props.history.push('/user/active');
}
