import { MultiSelectionBox } from 'bricks-of-sand';
import * as React from 'react';
import { useUserState } from '../../store';
import { UsersState } from '../../store/reducers';

export interface UserMultiSelectionProps {
  excludeUserId: number;
  placeholder: string;
  validation: { [userId: number]: string };
  onSelect(selection: UsersState): void;
}

export function UserMultiSelection({
  placeholder,
  excludeUserId,
  onSelect,
  validation,
}: UserMultiSelectionProps): JSX.Element | null {
  const users = useUserState();

  return (
    <MultiSelectionBox
      excludeIds={[excludeUserId]}
      errorMessageMap={validation}
      getItemIndex={user => (user ? user.id : 0)}
      itemToString={user => user.name}
      items={users}
      onSelect={onSelect}
      placeholder={placeholder}
    />
  );
}
