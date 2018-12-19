import {
  DropDownCard,
  DropDownCardItem,
  IconInput,
  Input,
  Relative,
} from 'bricks-of-sand';
import Downshift from 'downshift';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { User, getUserArray } from '../../store/reducers';
import { SearchIcon } from '../ui/icons/search';

interface OwnProps {
  userId?: number;
  autoFocus?: boolean;
  placeholder: string;
  getString?(user: User): string;
  onSelect(user: User): void;
}

interface StateProps {
  users: User[];
}

type Props = StateProps & OwnProps;

const mapStateToProps = (state: AppState): StateProps => ({
  users: getUserArray(state),
});

export const connectUser = connect(mapStateToProps);

export function UserSelection(props: Props): JSX.Element {
  const items = props.users.filter(user => {
    if (!props.userId) {
      return true;
    } else {
      return user.id !== props.userId;
    }
  });
  return (
    <Downshift
      onChange={selection => props.onSelect(selection)}
      itemToString={item => (item ? item.name : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <Relative>
            <Input
              {...getInputProps({
                placeholder: props.placeholder,
              })}
            />
            {isOpen && (
              <DropDownCard {...getMenuProps()}>
                {items
                  .filter(
                    item =>
                      !inputValue ||
                      item.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <DropDownCardItem
                      isHovered={highlightedIndex === index}
                      isSelected={selectedItem === item}
                      {...getItemProps({ item, index })}
                      key={item}
                    >
                      {item.name}
                    </DropDownCardItem>
                  ))}
              </DropDownCard>
            )}
          </Relative>
        </div>
      )}
    </Downshift>
  );
}

export const ConnectedUserSelectionList = connectUser(UserSelection);

export function UserSearch(props: Props): JSX.Element {
  const items = props.users;
  return (
    <Downshift
      onChange={selection => props.onSelect(selection)}
      itemToString={() => ''}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <Relative>
            <IconInput activeWidth="8rem" inactiveWidth="4rem">
              <FormattedMessage
                id="SEARCH"
                children={placeholder => (
                  <input
                    {...getInputProps({
                      placeholder: placeholder as string,
                    })}
                  />
                )}
              />
              <SearchIcon />
            </IconInput>
            {isOpen && (
              <DropDownCard {...getMenuProps()}>
                {items
                  .filter(
                    item =>
                      !inputValue ||
                      item.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <DropDownCardItem
                      isHovered={highlightedIndex === index}
                      isSelected={selectedItem === item}
                      {...getItemProps({ item, index })}
                      key={item}
                    >
                      {item.name}
                    </DropDownCardItem>
                  ))}
              </DropDownCard>
            )}
          </Relative>
        </div>
      )}
    </Downshift>
  );
}

export const ConnectedUserSearch = connectUser(UserSearch);
