import { MultiSelectionBox } from 'bricks-of-sand';
import * as React from 'react';
import { useUserState } from '../../store';
import { UsersState } from '../../store/reducers';

export interface UserMultiSelectionProps {
  excludeUserId: string;
  placeholder: string;
  validation: { [userId: string]: string };
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
    //@ts-ignore
    <MultiSelectionBox
      excludeIds={[excludeUserId]}
      errorMessageMap={validation}
      //@ts-ignore
      getItemIndex={user => (user ? user.id : 0)}
      itemToString={user => user.name}
      items={users}
      onSelect={onSelect}
      placeholder={placeholder}
    />
  );
}
