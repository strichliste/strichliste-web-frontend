import { Card } from 'bricks-of-sand';
import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { User, getUser } from '../../store/reducers';
import { ConnectedCurrency } from '../currency';
import { AlertText } from '../ui';

interface OwnProps {
  id: number;
}

interface StateProps {
  user?: User;
}

type UserCardProps = OwnProps & StateProps;

export function UserCard({ user }: UserCardProps): JSX.Element | null {
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
      <span>{user.name}</span>
      <AlertText value={user.balance}>
        <ConnectedCurrency value={user.balance} />
      </AlertText>
    </Card>
  );
}

const mapStateToProps = (state: AppState, { id }: OwnProps) => ({
  user: getUser(state, id),
});

export const ConnectedUserCard = connect(mapStateToProps)(UserCard);
