import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AutoGrid } from 'bricks-of-sand';
import { UserCard } from '.';
import { useInfiniteScrolling } from '../common/search-list/search-list';
import { useUserDetailUrl } from './user-router';

type UserListComponent = React.FC<{ userIds: string[] }>;
type RedirectUserListComponent = React.FC<{
  userIds: string[];
}>;
const PAGE_SIZE = 25;

export const UserList: UserListComponent = ({ userIds }) => {
  if (userIds.length < PAGE_SIZE) {
    return <PlainUserList userIds={userIds} />;
  }
  return <InfiniteUserList userIds={userIds} />;
};

const PlainUserList: RedirectUserListComponent = ({ userIds }) => {
  const getUserDetailUrl = useUserDetailUrl();
  return (
    <AutoGrid rows="5rem" columns="8rem">
      {userIds.map(id => (
        <Link key={id} to={getUserDetailUrl(id)}>
          <UserCard id={id} />
        </Link>
      ))}
    </AutoGrid>
  );
};

const InfiniteUserList: RedirectUserListComponent = ({ userIds }) => {
  const props = useInfiniteScrolling(userIds, PAGE_SIZE);
  return (
    <div style={{ marginTop: '-1rem' }}>
      <InfiniteScroll {...props}>
        <PlainUserList userIds={props.items} />
      </InfiniteScroll>
    </div>
  );
};
