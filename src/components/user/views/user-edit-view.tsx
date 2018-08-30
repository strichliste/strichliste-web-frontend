import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BackButton } from '../../common';
import { Card, FixedFooter } from '../../ui';
import { ConnectedUserEditForm } from '../edit-user-form';

export function UserEditView(
  props: RouteComponentProps<{ id: number }>
): JSX.Element {
  return (
    <>
      <Card margin="1rem">
        <ConnectedUserEditForm
          onSave={props.history.goBack}
          userId={props.match.params.id}
        />
      </Card>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
