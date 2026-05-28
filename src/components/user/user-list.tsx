import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { UserCard } from '.';
import { User } from '../../types';
import { useInfiniteScrolling } from '../common/search-list/search-list';
import { useUserDetailUrl } from './user-router';
import { CardGrid } from '../../bricks';

type UserListComponent = React.FC<{ users: User[] }>;
const PAGE_SIZE = 25;

export const UserList: UserListComponent = ({ users }) => {
  if (users.length < PAGE_SIZE) {
    return <PlainUserList users={users} />;
  }
  return <InfiniteUserList users={users} />;
};

const PlainUserList: UserListComponent = ({ users }) => {
  const getUserDetailUrl = useUserDetailUrl();
  return (
    <CardGrid>
      {users.map((user) => (
        <Link key={user.id} to={getUserDetailUrl(user.id)}>
          <UserCard user={user} />
        </Link>
      ))}
    </CardGrid>
  );
};

const InfiniteUserList: UserListComponent = ({ users }) => {
  const props = useInfiniteScrolling(users, PAGE_SIZE);
  return (
    <div style={{ marginTop: '-1rem' }}>
      <InfiniteScroll {...props}>
        <PlainUserList users={props.items} />
      </InfiniteScroll>
    </div>
  );
};
