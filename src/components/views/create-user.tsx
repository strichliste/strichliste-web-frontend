import * as React from 'react';
import { Card, CenterSection } from '../ui';
import { ConnectedCreateUserForm } from '../user/create-user-form';

export function CreateUser(): JSX.Element {
  return (
    <CenterSection>
      <Card>
        <div>
          <h2>neuen user anlegen</h2>
          <ConnectedCreateUserForm />
        </div>
      </Card>
    </CenterSection>
  );
}