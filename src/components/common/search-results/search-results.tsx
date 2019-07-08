import React, { useEffect } from 'react';
import { useDispatch } from 'redux-react-hook';
import { startLoadingUsers, User } from '../../../store/reducers';
import { useUserArray } from '../../../store';
import { SearchList } from '../search-list/search-list';
import { SearchResultItem } from './search-result-item/search-result-item';
import { RouteComponentProps } from 'react-router';

export const SearchResults: React.FC<RouteComponentProps> = props => {
  const userArray = useUserArray();
  const dispatch = useDispatch();
  useEffect(() => {
    startLoadingUsers(dispatch);
  }, [dispatch]);

  return (
    <div style={{ margin: '1rem' }}>
      <SearchList
        pageSize={10}
        renderItem={(user: User) => (
          <SearchResultItem
            key={user.id}
            name={user.name}
            onClick={() => console.log(user)}
          />
        )}
        items={userArray}
      ></SearchList>
    </div>
  );
};
