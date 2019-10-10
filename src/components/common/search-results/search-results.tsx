import React, { useEffect } from 'react';
import { useDispatch } from 'redux-react-hook';
import { startLoadingUsers, User } from '../../../store/reducers';
import { useUserArray } from '../../../store';
import { SearchList } from '../search-list/search-list';
import { SearchResultItem } from './search-result-item/search-result-item';
import { RouteComponentProps } from 'react-router';
import { useUserDetailUrl } from '../../user/user-router';

export const SearchResults: React.FC<RouteComponentProps> = props => {
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
  userId?: string | number;
  scrollableTarget?: string;
}> = ({ onUserSelect, userId, scrollableTarget }) => {
  const userArray = useUserArray();
  const dispatch = useDispatch();
  useEffect(() => {
    startLoadingUsers(dispatch);
  }, [dispatch]);
  const filteredUsers = userId
    ? userArray.filter(user => Number(user.id) !== Number(userId))
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
