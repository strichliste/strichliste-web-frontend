import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ConnectedUserEditForm } from '../edit-user-form';

export function UserEditView(
  props: RouteComponentProps<{ id: string }>
): JSX.Element {
  return (
    <>
      <ConnectedUserEditForm
        onCancel={props.history.goBack}
        onSave={props.history.goBack}
        userId={Number(props.match.params.id)}
      />
    </>
  );
}
