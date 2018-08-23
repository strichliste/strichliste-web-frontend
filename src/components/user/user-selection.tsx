import Downshift from 'downshift';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { User, getUserArray } from '../../store/reducers';
import { AutoGrid, MaterialInput } from '../ui';
import { ConnectedUserCard } from './user-card';

interface OwnProps {
  userId?: number;
  onSelect(user: User): void;
}

interface StateProps {
  users: User[];
}

type Props = StateProps & OwnProps;

export function UserSelection(props: Props): JSX.Element {
  const items = props.users;

  return (
    <Downshift
      onChange={selection => props.onSelect(selection)}
      itemToString={item => (item ? item.value : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <FormattedMessage id="USER_SEARCH_HEADLINE" />
          <MaterialInput>
            <label {...getLabelProps()}>
              <FormattedMessage id="USER_SELECTION_LIST_LABEL" />
            </label>
            <input {...getInputProps()} autoFocus={true} />
            <ul {...getMenuProps()}>
              {isOpen
                ? items
                    .filter(
                      item =>
                        !inputValue ||
                        item.name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        {...getItemProps({
                          key: item.name,
                          index,
                          item,
                        })}
                      >
                        {item.name}
                      </li>
                    ))
                : null}
            </ul>
          </MaterialInput>
        </div>
      )}
    </Downshift>
  );
}

const mapStateToProps = (state: AppState): StateProps => ({
  users: getUserArray(state),
});

export const ConnectedUserSelectionList = connect(mapStateToProps)(
  UserSelection
);

function UserSelectionCards(props: Props): JSX.Element {
  const items = props.users;

  return (
    <Downshift
      onChange={selection => props.onSelect(selection)}
      itemToString={item => (item ? item.value : '')}
    >
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue }) => (
        <div>
          <FormattedMessage id="USER_SEARCH_HEADLINE" />

          <MaterialInput>
            <input {...getInputProps()} autoFocus={true} />
          </MaterialInput>
          <div {...getMenuProps()}>
            <AutoGrid rows="5rem" columns="10rem">
              {items
                .filter(
                  item =>
                    !inputValue ||
                    item.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    {...getItemProps({
                      key: item.name,
                      index,
                      item,
                    })}
                  >
                    <ConnectedUserCard id={item.id} />
                  </div>
                ))}
            </AutoGrid>
          </div>
        </div>
      )}
    </Downshift>
  );
}

export const ConnectedUserSelectionCards = connect(mapStateToProps)(
  UserSelectionCards
);
