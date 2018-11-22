import { Action } from '../action';
import { AppState } from '../store';

export enum SearchTypes {
  UpdateSearchAction = 'UpdateSearchAction',
}

export interface UpdateSearchAction {
  type: SearchTypes.UpdateSearchAction;
  payload: Search;
}

export function updateSearch(payload: Search): UpdateSearchAction {
  return {
    type: SearchTypes.UpdateSearchAction,
    payload,
  };
}
export type UpdateSearch = typeof updateSearch;

export type SearchActions = UpdateSearchAction;

interface Search {
  query: string;
}

const initialState: Search = { query: '' };

export function search(state: Search = initialState, action: Action): Search {
  switch (action.type) {
    case SearchTypes.UpdateSearchAction:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function getSearch(state: AppState): Search {
  return state.search;
}

export function getSearchQuery(state: AppState): string {
  return getSearch(state).query;
}
