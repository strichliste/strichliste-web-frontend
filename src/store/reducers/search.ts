import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

interface Search {
  query: string;
}

const initialState: Search = { query: '' };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateSearch: (state, action: PayloadAction<Search>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { updateSearch } = searchSlice.actions;
export const search = searchSlice.reducer;
export type UpdateSearch = typeof updateSearch;
export type SearchActions = ReturnType<typeof updateSearch>;

export function getSearch(state: AppState): Search {
  return state.search;
}

export function getSearchQuery(state: AppState): string {
  return getSearch(state).query;
}
