import { AutoComplete, SearchAutoComplete } from 'bricks-of-sand';
import * as React from 'react';
// import { FormattedMessage } from 'react-intl';
import { useUserArray } from '../../store';
import { User } from '../../store/reducers';
import { FormattedMessage } from 'react-intl';

interface Props {
  userId?: string;
  autoFocus?: boolean;
  placeholder: string;
  disabled?: boolean;
  getString?(user: User): string;
  onSelect(user: User): void;
}

export function UserSelection(props: Props): JSX.Element {
  const users = props.userId
    ? useUserArray().filter(user => Number(user.id) !== Number(props.userId))
    : useUserArray();

  return <AutoComplete {...props} items={users} />;
}

export function UserSearch(props: Props): JSX.Element {
  const users = props.userId
    ? useUserArray().filter(user => Number(user.id) !== Number(props.userId))
    : useUserArray();

  return (
    <FormattedMessage id="SEARCH">
      {placeholder => (
        //@ts-ignore
        <SearchAutoComplete
          {...props}
          items={users}
          placeholder={placeholder as string}
          activeWidth="8rem"
          inactiveWidth="4rem"
        />
      )}
    </FormattedMessage>
  );
}
