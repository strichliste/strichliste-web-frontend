import React from 'react';
import { User } from '../../../types';
import { useUsers } from '../../../queries';
import { SearchList } from '../search-list/search-list';
import { SearchResultItem } from './search-result-item/search-result-item';
import { RouteComponentProps } from '../../../routing';
import { useUserDetailUrl } from '../../user/user-router';

export const SearchResults: React.FC<RouteComponentProps> = (props) => {
  const userDetailUrl = useUserDetailUrl();
  const handleOnUserSelect = (user: User) =>
    props.history.push(userDetailUrl(user.id));
  return (
    <div style={{ margin: '1rem' }}>
      <UserSearchList onUserSelect={handleOnUserSelect} />
    </div>
  );
};

export const UserSearchList: React.FC<{
  onUserSelect(user: User): void;
  filterUsers?: User[];
  filterUserId?: string;
  scrollableTarget?: string;
}> = ({ onUserSelect, filterUsers, filterUserId, scrollableTarget }) => {
  const userArray = useUsers();
  const filteredUsers = filterUsers
    ? userArray.filter(
        (user) => !filterUsers.map((user) => user.id).includes(user.id)
      )
    : filterUserId
      ? userArray.filter((user) => user.id !== filterUserId)
      : userArray;

  return (
    <SearchList
      scrollableTarget={scrollableTarget}
      pageSize={10}
      renderItem={(user: User) => (
        <SearchResultItem
          key={user.id}
          name={user.name}
          onClick={() => onUserSelect(user)}
        />
      )}
      items={filteredUsers}
    />
  );
};
