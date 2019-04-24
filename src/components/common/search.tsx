import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { store } from '../../store';
import { startLoadingUsers } from '../../store/reducers';
import { getUserDetailLink } from '../user/user-router';
import { UserSearch } from '../user/user-selection';

export type Props = RouteComponentProps;

export const SearchInput = withRouter((props: Props) => {
  React.useEffect(() => {
    startLoadingUsers(store.dispatch);
  }, []);
  return (
    <FormattedMessage
      id="SEARCH"
      children={placeholder => (
        <UserSearch
          placeholder={placeholder as string}
          onSelect={user => {
            if (user && user.id) props.history.push(getUserDetailLink(user.id));
          }}
        />
      )}
    />
  );
});
