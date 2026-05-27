import { useQuery } from '@tanstack/react-query';

import { get, post } from '../services/api';
import { errorHandler, MaybeResponse } from '../services/error-handler';
import { store } from '../store/store';
import { useAppSelector } from '../store/hooks';
import { queryClient } from '../services/query-client';
import { User, UserUpdateParams } from '../store/reducers/user';
import { getSearchQuery } from '../store/reducers/search';
import { queryKeys } from './keys';

export type { User, UserUpdateParams } from '../store/reducers/user';

type UsersResult = MaybeResponse & { users: User[] };
type UserResult = MaybeResponse & { user: User };

const byName = (a: User, b: User) => a.name.localeCompare(b.name);

function usersUrl(isActive?: boolean): string {
  const params = new URLSearchParams({ deleted: 'false' });
  if (isActive !== undefined) {
    params.set('active', String(isActive));
  }
  return `user?${params.toString()}`;
}

// --- Queries -------------------------------------------------------------

export function useUsers(isActive?: boolean): User[] {
  const { data } = useQuery({
    queryKey: queryKeys.users(isActive),
    queryFn: async (): Promise<User[]> => {
      const data = await errorHandler<UsersResult>(store.dispatch, {
        promise: get(usersUrl(isActive)),
        defaultError: 'USERS_LOADING_FAILED',
      });
      return (data?.users ?? []).slice().sort(byName);
    },
  });
  return data ?? [];
}

export function useUser(id: string): User | undefined {
  const { data } = useQuery({
    queryKey: queryKeys.user(id),
    queryFn: (): Promise<User> => get(`user/${id}`).then((res) => res.user),
    enabled: Boolean(id),
  });
  return data;
}

export function useUserArray(): User[] {
  return useUsers();
}

export function useUserName(id: string): string {
  return useUser(id)?.name ?? '';
}

export function useUserBalance(id: string): number {
  return useUser(id)?.balance ?? 0;
}

/** Active/inactive users filtered by the current search query (Redux). */
export function useFilteredUsers(isActive: boolean): User[] {
  const users = useUsers(isActive);
  const query = useAppSelector(getSearchQuery);
  return users
    .filter((user) => user.isActive === isActive && user.isDisabled === false)
    .filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
}

// --- Mutations -----------------------------------------------------------

function invalidateUsers() {
  queryClient.invalidateQueries({ queryKey: ['users'] });
}

export async function createUser(name: string): Promise<User | undefined> {
  const data = await errorHandler<UserResult>(store.dispatch, {
    promise: post('user', { name }),
    defaultError: 'USERS_CREATION_FAILED',
    errors: { UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST' },
  });
  if (data?.user) {
    invalidateUsers();
    return data.user;
  }
  return undefined;
}

export async function updateUser(
  userId: string,
  params: UserUpdateParams
): Promise<User | undefined> {
  const data = await errorHandler<UserResult>(store.dispatch, {
    promise: post(`user/${userId}`, params),
    defaultError: 'USER_EDIT_USER_FAILED',
    errors: { UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST' },
  });
  if (data?.user) {
    queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
    invalidateUsers();
    return data.user;
  }
  return undefined;
}
