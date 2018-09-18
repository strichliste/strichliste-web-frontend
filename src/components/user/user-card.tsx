import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { User, getUser } from '../../store/reducers';
import { ConnectedCurrency } from '../currency';
import { AlertText, Ellipsis } from '../ui';
import { Card } from '../ui/card';

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
    <Card hover width="100%" height="6rem">
      <AlertText value={user.balance}>
        <Ellipsis>{user.name}</Ellipsis>
        <ConnectedCurrency value={user.balance} />
      </AlertText>
    </Card>
  );
}

const mapStateToProps = (state: AppState, { id }: OwnProps) => ({
  user: getUser(state, id),
});

export const ConnectedUserCard = connect(mapStateToProps)(UserCard);
