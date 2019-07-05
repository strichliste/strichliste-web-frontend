import React, { useEffect } from 'react';
import { useDispatch } from 'redux-react-hook';
import { startLoadingUsers, User } from '../../../store/reducers';
import { useUserArray } from '../../../store';
import { SearchList } from '../search-list/search-list';
import { TextButton } from 'bricks-of-sand';

export const SearchResults = () => {
  const userArray = useUserArray();
  const dispatch = useDispatch();
  useEffect(() => {
    startLoadingUsers(dispatch);
  }, [dispatch]);

  return (
    <div>
      <SearchList
        pageSize={10}
        renderItem={(user: User) => (
          <div key={user.id}>
            <TextButton>{user.name}</TextButton>
          </div>
        )}
        items={userArray}
      ></SearchList>
    </div>
  );
};
