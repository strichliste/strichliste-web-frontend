import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { AutoGrid } from 'bricks-of-sand';
import { UserCard } from '.';

type UserListComponent = React.FC<{ userIds: string[] }>;
const PAGE_SIZE = 25;
export const UserList: UserListComponent = ({ userIds }) => {
  if (userIds.length < PAGE_SIZE) {
    return <PlainUserList userIds={userIds} />;
  }
  return <InfiniteUserList userIds={userIds} />;
};

const PlainUserList: UserListComponent = ({ userIds }) => (
  <AutoGrid rows="5rem" columns="8rem">
    {userIds.map(id => (
      <Link key={id} to={`/user/${id}`}>
        <UserCard id={id} />
      </Link>
    ))}
  </AutoGrid>
);

const InfiniteUserList: UserListComponent = ({ userIds }) => {
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
      <PlainUserList userIds={items} />
    </InfiniteScroll>
  );
};
