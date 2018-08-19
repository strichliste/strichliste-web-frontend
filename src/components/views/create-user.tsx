import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { BackButton } from '../common';
import { Card, CenterSection, FixedFooter } from '../ui';
import { ConnectedCreateUserForm } from '../user/create-user-form';

export function CreateUser(props: RouteComponentProps<{}>): JSX.Element {
  return (
    <CenterSection>
      <Card>
        <div>
          <h2>
            <FormattedMessage id="USER_CREATE_HEADLINE" />
          </h2>
          <ConnectedCreateUserForm
            userCreated={(id: number) => userCreated(props, id)}
          />
        </div>
      </Card>
      <FixedFooter>
        <BackButton />
      </FixedFooter>
    </CenterSection>
  );
}

function userCreated(props: RouteComponentProps<{}>, id: number): void {
  props.history.push(`user/${id}`);
}
