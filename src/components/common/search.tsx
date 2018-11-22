import { IconInput } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  UpdateSearch,
  getSearchQuery,
  updateSearch,
} from '../../store/reducers';
import { SearchIcon } from '../ui/icons/search';

interface StateProps {
  query: string;
}

interface ActionProps {
  updateSearch: UpdateSearch;
}

export type SearchInputProps = ActionProps & StateProps;

export function SearchInput({
  query,
  updateSearch,
}: SearchInputProps): JSX.Element | null {
  return (
    <IconInput activeWidth="8rem" inactiveWidth="4rem">
      <FormattedMessage
        id="SEARCH"
        children={placeholder => (
          <input
            value={query}
            onChange={e => updateSearch({ query: e.target.value })}
            placeholder={placeholder as string}
            type="text"
          />
        )}
      />
      <SearchIcon />
    </IconInput>
  );
}

const mapStateToProps = (state: AppState): StateProps => ({
  query: getSearchQuery(state),
});

const mapDispatchToProps = {
  updateSearch,
};

export const ConnectedSearchInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
