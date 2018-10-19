import { Transaction, TransactionTypes } from '.';
import { Action } from '..';
import { get, post } from '../../services/api';
import { errorHandler } from '../../services/error-handler';
import { DefaultThunkAction } from '../action';
import { AppState, Dispatch, ThunkAction } from '../store';

export interface GetUsersResponse {
  users: User[];
}

export interface User {
  id: number;
  name: string;
  isActive: boolean;
  isDisabled?: boolean;
  email?: string | null;
  balance: number;
  created: string;
  updated?: string;
  transactions?: { [key: number]: number };
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

export function startLoadingUsers(
  isActive?: boolean,
  isDeleted?: boolean
): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    const params: { deleted?: string; active?: string } = {};
    if (isDeleted !== undefined) {
      params.deleted = isDeleted.toString();
    }
    if (isActive !== undefined) {
      params.active = isActive.toString();
    }
    const promise = get(
      `user${Object.keys(params).reduce((paramString, param, index) => {
        const next = `${paramString}${index === 0 ? '?' : '&'}${param}=${
          params[param]
        }`;
        return next;
      }, '')}`
    );
    const data = await errorHandler(dispatch, {
      promise,
      defaultError: 'USERS_LOADING_FAILED',
    });
    if (data) {
      dispatch(usersLoaded(data));
    }
  };
}

export function startCreatingUser(
  name: string
): ThunkAction<Promise<User | undefined>> {
  return async (dispatch: Dispatch) => {
    const promise = post('user', {
      name,
    });
    const data = await errorHandler(dispatch, {
      promise,
      defaultError: 'USERS_CREATION_FAILED',
      errors: {
        UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST',
      },
    });

    if (data && data.user) {
      dispatch(userDetailsLoaded(data.user));
      return data.user;
    }

    return undefined;
  };
}
export interface UserUpdateParams {
  name: string;
  email?: string;
  isDisabled: boolean;
}
export function startUpdateUser(
  userId: number,
  params: UserUpdateParams
): ThunkAction<Promise<User | undefined>> {
  return async (dispatch: Dispatch) => {
    const promise = post(`user/${userId}`, params);
    const data = await errorHandler(dispatch, {
      promise,
      defaultError: 'USER_EDIT_USER_FAILED',
      errors: {
        UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST',
      },
    });
    if (data && data.user) {
      dispatch(userDetailsLoaded(data.user));
      return data.user;
    }

    return undefined;
  };
}

export type UserActions = UsersLoadedAction | UserDetailsLoadedAction;

export function user(state: UsersState = {}, action: Action): UsersState {
  switch (action.type) {
    case UserActionTypes.UsersLoaded:
      return action.payload.users.reduce(
        (users: UsersState, user: User) => ({
          ...users,
          [user.id]: { ...state[user.id], ...user },
        }),
        state
      );
    case UserActionTypes.UserDetailsLoaded:
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    case TransactionTypes.TransactionsLoaded:
      const user = getUserFromStateOrPayload(state, action.payload[0]);
      if (!user) {
        return state;
      }
      return {
        ...state,
        [user.id]: {
          ...user,
          transactions: action.payload.reduce(
            (nextTransactions, transaction) => {
              return { ...nextTransactions, [transaction.id]: transaction.id };
            },
            user.transactions
          ),
        },
      };
    default:
      return state;
  }
}

function getUserFromStateOrPayload(
  state: UsersState,
  transaction?: Transaction
): User | undefined {
  if (!transaction) {
    return undefined;
  }

  const userId = transaction.user.id;
  return state[userId] ? state[userId] : transaction.user;
}

export function getUserState(state: AppState): UsersState {
  return state.user;
}

export function getUserArray(state: AppState): User[] {
  return Object.values(getUserState(state));
}

export function getUser(state: AppState, userId: number): User | undefined {
  return getUserState(state)[userId];
}

export function getUserTransactionsArray(
  state: AppState,
  userId: number
): number[] {
  const user = getUser(state, userId);
  if (user) {
    return Object.values(user.transactions ? user.transactions : []).sort(
      (a, b) => Number(b) - Number(a)
    );
  } else {
    return [];
  }
}
