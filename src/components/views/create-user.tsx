import * as React from 'react';
import { Card } from '../ui';
import { CenterGrid } from '../ui/center-grid';
import { CreateUserForm } from '../user/create-user-form';

export function CreateUser(): JSX.Element {
  return (
    <CenterGrid>
      <Card>
        <div>
          <h2>neuen user anlegen</h2>
          <CreateUserForm />
        </div>
      </Card>
    </CenterGrid>
  );
}
