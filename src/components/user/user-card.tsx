import * as React from 'react';

import { useUser } from '../../store';
import { Currency } from '../currency';
import { UserName } from './user-name';
import { Card, AlertText } from '../../bricks';

import styles from './user-card.module.css';

interface Props {
  id: string;
}

export function UserCard({ id }: Props): JSX.Element | null {
  const user = useUser(id);
  if (!user) {
    return null;
  }

  return (
    <Card className={styles.userCard}>
      <UserName name={user.name} />
      <AlertText value={user.balance}>
        <Currency value={user.balance} />
      </AlertText>
    </Card>
  );
}
