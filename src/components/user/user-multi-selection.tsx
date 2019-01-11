import { MultiSelectionBox } from 'bricks-of-sand';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { UsersState } from '../../store/reducers';

interface OwnProps {
  excludeUserId: number;
  placeholder: string;
  validation: { [userId: number]: string };
  onSelect(selection: UsersState): void;
}

interface StateProps {
  users: UsersState;
}

export type UserMultiSelectionProps = StateProps & OwnProps;

export function UserMultiSelection({
  placeholder,
  excludeUserId,
  onSelect,
  users,
  validation,
}: UserMultiSelectionProps): JSX.Element | null {
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

const mapStateToProps = (state: AppState): StateProps => ({
  users: state.user,
});

export const ConnectedUserMultiSelection = connect(mapStateToProps)(
  UserMultiSelection
);
