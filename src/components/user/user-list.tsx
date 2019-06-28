import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AutoGrid } from 'bricks-of-sand';
import { UserCard } from '.';
import { useSettings } from '../../store';

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
  const [page, setPage] = useState(1);
  const nextPage = () => {
    setPage(page + 1);
  };
  const items = userIds.slice(0, PAGE_SIZE * page);

  useEffect(() => {
    const hasVScroll = document.body.scrollHeight > document.body.clientHeight;
    if (page === 1 && !hasVScroll && items.length < userIds.length) {
      setPage(page + 2);
    }
  }, []);

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={nextPage}
      hasMore={true}
      loader={null}
    >
      <PlainUserList redirect={redirect} userIds={items} />
    </InfiniteScroll>
  );
};
