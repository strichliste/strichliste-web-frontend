import { Action } from '..';
import { get } from '../../services/api';
import { Dispatch, ThunkAction } from '../store';
import { UsersState } from './user';

export interface GetUsersResponse {
  users: User[];
}

export interface User {
  id: number;
  name: string;
  mailAddress: string;
  balance: number;
  lastTransaction: string;
  countOfTransactions: number;
  weightedCountOfPurchases?: number;
  activeDays: number;
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

export function startLoadingUserDetails(
  id: number
): ThunkAction<Promise<void>> {
  return async (dispatch: Dispatch) => {
    const details = await get(`user/${id}`);
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

export function startLoadingUsers(): ThunkAction<Promise<void>> {
  return async (dispatch: Dispatch) => {
    try {
      const data = await get('user');
      dispatch(usersLoaded(data));
    } catch (error) {
      console.log(error);
    }
  };
}

export type UserActions = UsersLoadedAction | UserDetailsLoadedAction;

export function user(state: UsersState = {}, action: Action): UsersState {
  switch (action.type) {
    case UserActionTypes.UsersLoaded:
      return action.payload.users.reduce((users, user) => {
        return { ...users, [user.id]: user };
      }, state);
    case UserActionTypes.UserDetailsLoaded:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
}
