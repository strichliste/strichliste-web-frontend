import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AutoGrid } from 'bricks-of-sand';
import { UserCard } from '.';
import { useSettings } from '../../store';
import { useInfiniteScrolling } from '../common/search-list/search-list';

type UserListComponent = React.FC<{ userIds: string[] }>;
type RedirectUserListComponent = React.FC<{
  userIds: string[];
  redirect: string;
}>;
const PAGE_SIZE = 25;

export const UserList: UserListComponent = ({ userIds }) => {
  const settings = useSettings();
  const redirect = settings.article.autoOpen ? '/article' : '';
  if (userIds.length < PAGE_SIZE) {
    return <PlainUserList redirect={redirect} userIds={userIds} />;
  }
  return <InfiniteUserList redirect={redirect} userIds={userIds} />;
};

const PlainUserList: RedirectUserListComponent = ({ userIds, redirect }) => (
  <AutoGrid rows="5rem" columns="8rem">
    {userIds.map(id => (
      <Link key={id} to={`/user/${id + redirect}`}>
        <UserCard id={id} />
      </Link>
    ))}
  </AutoGrid>
);

const InfiniteUserList: RedirectUserListComponent = ({ userIds, redirect }) => {
  const props = useInfiniteScrolling(userIds, PAGE_SIZE);
  return (
    <InfiniteScroll {...props}>
      <PlainUserList redirect={redirect} userIds={props.items} />
    </InfiniteScroll>
  );
};
