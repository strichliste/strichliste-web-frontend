import { Transaction, TransactionTypes, getTransaction } from '.';
import { Article } from '.';
import { Action } from '..';
import { get, post } from '../../services/api';
import { errorHandler } from '../../services/error-handler';
import { AppState, Dispatch } from '../store';
import { getSearchQuery } from './search';

export interface GetUsersResponse {
  users: User[];
}

export interface User {
  id: string;
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
  [id: string]: User;
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

export async function startLoadingUserDetails(
  dispatch: Dispatch,
  id: string
): Promise<void> {
  const details = await get(`user/${id}`);
  dispatch(userDetailsLoaded(details.user));
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

export async function startLoadingUsers(
  dispatch: Dispatch,
  isActive?: boolean
): Promise<void> {
  const params: { deleted?: string; active?: string } = {};
  params.deleted = 'false';
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
}

export async function startCreatingUser(
  dispatch: Dispatch,
  name: string
): Promise<User | undefined> {
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
}
export interface UserUpdateParams {
  name: string;
  email?: string;
  isDisabled: boolean;
}
export async function startUpdateUser(
  dispatch: Dispatch,
  userId: string,
  params: UserUpdateParams
): Promise<User | undefined> {
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
      // eslint-disable-next-line no-case-declarations
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

export function getUserState(state: AppState): UsersState {
  return state.user;
}

export function getUserArray(state: AppState): User[] {
  return Object.values(getUserState(state)).sort((a: User, b: User) =>
    a.name.localeCompare(b.name)
  );
}

export function getUser(state: AppState, userId: string): User | undefined {
  return getUserState(state)[userId];
}

export function getFilteredUserIds(
  state: AppState,
  isActive: boolean
): string[] {
  const query = getSearchQuery(state);
  const activeFilteredUsers = getUserArray(state).filter(
    user => user.isActive === isActive && user.isDisabled === false
  );
  if (!query) {
    activeFilteredUsers.map(user => user.id);
  }

  return activeFilteredUsers
    .filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
    .map(user => user.id);
}

export function getUserBalance(state: AppState, userId: string): number {
  const user = getUser(state, userId);
  return user ? user.balance : 0;
}

export function getUserTransactionsArray(
  state: AppState,
  userId: string
): number[] {
  const user = getUser(state, userId);
  if (user && user.transactions) {
    return Object.values(user.transactions).sort(
      (a, b) => Number(b) - Number(a)
    );
  } else {
    return [];
  }
}

export function getUserRecentArticles(
  state: AppState,
  userId: string
): Article[] {
  const TRANSACTIONS_TO_SCAN_FOR_RECENT_ARTICLES_LIMIT = 30;
  const recentUserArticlesWithDuplicates = getUserTransactionsArray(state, userId)
    .slice(0, TRANSACTIONS_TO_SCAN_FOR_RECENT_ARTICLES_LIMIT) 
    .map((id) => getTransaction(state, id))
    .map((transaction) => transaction?.article)
    .filter((article): article is Article => article !== undefined);

  const userRecentArticles = new Map<string, Article>();
  recentUserArticlesWithDuplicates.forEach((article) => {
    if (!userRecentArticles.has(article.name)) {
      userRecentArticles.set(article.name, article);
    }
  });

  return Array.from(userRecentArticles.values());
}
