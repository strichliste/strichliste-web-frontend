import { AlertText, Card } from 'bricks-of-sand';
import * as React from 'react';

import { useUser } from '../../store';
import { Currency } from '../currency';
import { UserName } from './user-name';

interface Props {
  id: number;
}

export function UserCard({ id }: Props): JSX.Element | null {
  const user = useUser(id);
  if (!user) {
    return null;
  }

  return (
    <Card
      flex
      justifyContent="space-between"
      flexDirection="column"
      hover="level3"
      height="6rem"
    >
      <UserName name={user.name} />
      <AlertText value={user.balance}>
        <Currency value={user.balance} />
      </AlertText>
    </Card>
  );
}
