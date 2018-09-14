import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BackButton } from '../../common';
import { Card, FixedFooter } from '../../ui';
import { ConnectedUserEditForm } from '../edit-user-form';

export function UserEditView(
  props: RouteComponentProps<{ id: string }>
): JSX.Element {
  return (
    <>
      <Card margin="1rem">
        <ConnectedUserEditForm
          onSave={props.history.goBack}
          userId={Number(props.match.params.id)}
        />
      </Card>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </>
  );
}
