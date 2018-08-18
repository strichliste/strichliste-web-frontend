import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../store';
import { User } from '../../store/reducers';
import { Card } from '../ui/card';

interface OwnProps {
  id: number;
}

interface StateProps {
  user: User;
}

type UserCardProps = OwnProps & StateProps;

export function UserCard({ user }: UserCardProps): JSX.Element {
  return (
    <Card>
      <div>
        <p>{user.name}</p>
        <p>{user.balance}</p>
      </div>
    </Card>
  );
}

const mapStateToProps = (state: AppState, { id }: OwnProps) => ({
  user: state.user[id],
});

export const ConnectedUserCard = connect(mapStateToProps)(UserCard);
