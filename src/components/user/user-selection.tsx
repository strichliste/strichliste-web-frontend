import {
  DropDownCard,
  DropDownCardItem,
  Input,
  Relative,
} from 'bricks-of-sand';
import Downshift from 'downshift';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { User, getUserArray } from '../../store/reducers';

interface OwnProps {
  userId?: number;
  autoFocus?: boolean;
  placeholder?: string;
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
  const items = props.users;

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
            <FormattedMessage
              id="USER_SELECTION_LIST_LABEL"
              children={placeholder => (
                <>
                  <Input
                    {...getInputProps({
                      placeholder: placeholder as string,
                    })}
                  />
                  {isOpen && (
                    <DropDownCard {...getMenuProps()}>
                      {items
                        .filter(
                          item =>
                            !inputValue ||
                            item.name
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
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
                </>
              )}
            />
          </Relative>
        </div>
      )}
    </Downshift>
  );
}

export const ConnectedUserSelectionList = connectUser(UserSelection);
