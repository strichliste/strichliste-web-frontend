import Downshift from 'downshift';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { User, getUserArray } from '../../store/reducers';
import { MaterialInput } from '../ui';

interface OwnProps {
  userId: number;
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
          <MaterialInput>
            <label {...getLabelProps()}>
              <FormattedMessage id="USER_SELECTION_LIST_LABEL" />
            </label>
            <input {...getInputProps()} />
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
                          style: {
                            backgroundColor:
                              highlightedIndex === index
                                ? 'lightgray'
                                : 'white',
                            fontWeight:
                              selectedItem === item ? 'bold' : 'normal',
                          },
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
