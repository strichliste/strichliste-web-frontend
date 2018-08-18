import { Action } from '..';
import { fetchJson, get, post } from '../../services/api';
import { DefaultThunkAction } from '../action';
import { Dispatch } from '../store';
import { UsersState } from './user';

export interface GetUsersResponse {
  users: User[];
}

export interface User {
  id: number;
  name: string;
  active: boolean;
  email?: string;
  balance: number;
  created: string;
  updated?: string;
  transactions: string[];
}

export interface UsersState {
  [id: number]: User;
}

export interface Boundaries {
  upper: number;
  lower: number;
}

export interface RootObject {
  boundaries: Boundaries;
}

export enum UserActionTypes {
  StartLoadingUsers = '[USER] Start_Loading',
  StartLoadingUserDetails = '[USER] Start_Loading_Details',
  UserDetailsLoaded = '[USER] Loaded_Details',
  UsersLoaded = '[USER] Loaded',
  UsersLoadedFailed = '[USER] Loaded Failed',
}

export interface UserDetailsLoadedAction {
  type: UserActionTypes.UserDetailsLoaded;
  payload: User;
}
export function userDetailsLoaded(payload: User): UserDetailsLoadedAction {
  return {
    type: UserActionTypes.UserDetailsLoaded,
    payload,
  };
}

export function startLoadingUserDetails(id: number): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    const details = await fetchJson(`user/${id}`, { mode: 'cors' });
    dispatch(userDetailsLoaded(details.user));
  };
}

export interface UsersLoadedAction {
  type: UserActionTypes.UsersLoaded;
  payload: GetUsersResponse;
}
export function usersLoaded(payload: GetUsersResponse): UsersLoadedAction {
  return {
    type: UserActionTypes.UsersLoaded,
    payload,
  };
}

export function startLoadingUsers(): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const data = await get('user?stale=true');
      console.log(data);

      dispatch(usersLoaded(data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function startCreatingUser(name: string): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    try {
      const data = await post('user', {
        name,
      });
      dispatch(userDetailsLoaded(data.user));
    } catch (error) {
      console.log(error);
    }
  };
}

export type UserActions = UsersLoadedAction | UserDetailsLoadedAction;

export function user(state: UsersState = {}, action: Action): UsersState {
  switch (action.type) {
    case UserActionTypes.UsersLoaded:
      return action.payload.users.reduce(
        (users: UsersState, user: User) => ({ ...users, [user.id]: user }),
        state
      );
    case UserActionTypes.UserDetailsLoaded:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
}
