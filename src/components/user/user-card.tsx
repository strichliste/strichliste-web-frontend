import * as React from 'react';

import { User } from '../../types';
import { Currency } from '../currency';
import { UserName } from './user-name';
import { Card, AlertText } from '../../bricks';

import styles from './user-card.module.css';

interface Props {
  user: User;
}

export function UserCard({ user }: Props): React.JSX.Element | null {
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
