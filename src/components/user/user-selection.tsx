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
import { useUserArray } from '../../store';
import { User } from '../../store/reducers';
import { SearchIcon } from '../ui/icons/search';

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
  const items = users.filter(user => {
    if (!props.userId) {
      return true;
    } else {
      return user.id !== props.userId;
    }
  });
  return (
    <Downshift
      onChange={selection => props.onSelect(selection)}
      itemToString={
        props.getString ? props.getString : item => (item ? item.name : '')
      }
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
                disabled: props.disabled,
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
                      key={item.name}
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

export function UserSearch(props: Props): JSX.Element {
  const users = useUserArray();

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
              <FormattedMessage id="SEARCH">
                {placeholder => (
                  <input
                    {...getInputProps({
                      placeholder: placeholder as string,
                      disabled: props.disabled,
                    })}
                  />
                )}
              </FormattedMessage>
              <SearchIcon />
            </IconInput>
            {isOpen && (
              <DropDownCard {...getMenuProps()}>
                {users
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
                      key={item.name}
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
