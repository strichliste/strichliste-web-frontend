import * as React from 'react';
// import { FormattedMessage } from 'react-intl';
import { useUserArray } from '../../store';
import { User } from '../../store/reducers';

interface Props {
  userId?: string;
  autoFocus?: boolean;
  placeholder: string;
  disabled?: boolean;
  getString?(user: User): string;
  onSelect(user: User): void;
}

export function UserSelection(props: Props): JSX.Element {
  const users = useUserArray();
  const filteredUsers = props.userId
    ? users.filter(user => Number(user.id) !== Number(props.userId))
    : users;
  return <div></div>;
}

export function UserSearch(props: Props): JSX.Element {
  const users = useUserArray();
  const filteredUsers = props.userId
    ? users.filter(user => Number(user.id) !== Number(props.userId))
    : users;

  return <div></div>;
}
