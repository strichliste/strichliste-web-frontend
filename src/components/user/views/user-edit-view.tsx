import * as React from 'react';
import { ConnectedUserEditForm } from '../edit-user-form';
import { UserRouteProps, getUserDetailLink } from '../user-router';

export function UserEditView(props: UserRouteProps): JSX.Element {
  const id = props.match.params.id;
  return (
    <>
      <ConnectedUserEditForm
        onCancel={navigateToUserDetails(props, id)}
        onSave={navigateToUserDetails(props, id)}
        userId={Number(id)}
      />
    </>
  );
}
function navigateToUserDetails(props: UserRouteProps, id: string): () => void {
  return () => props.history.push(getUserDetailLink(Number(id)));
}
