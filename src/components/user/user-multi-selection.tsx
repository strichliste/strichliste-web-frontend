import { MultiSelectionBox } from 'bricks-of-sand';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { User, UsersState } from '../../store/reducers';

interface OwnProps {
  placeholder: string;
  validation: { [userId: number]: string };
  onSelect(selection: UsersState): void;
}

interface StateProps {
  users: UsersState;
}

interface ActionProps {}

export type UserMultiSelectionProps = ActionProps & StateProps & OwnProps;

export function UserMultiSelection({
  placeholder,
  onSelect,
  users,
  validation,
}: UserMultiSelectionProps): JSX.Element | null {
  return (
    <MultiSelectionBox
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

const mapDispatchToProps = {};

export const ConnectedUserMultiSelection = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMultiSelection);
