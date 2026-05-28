import { useMutation, useQuery } from '@tanstack/react-query';

import { get, post } from '../services/api';
import { errorHandler, MaybeResponse } from '../services/error-handler';
import { queryClient } from '../services/query-client';
import { User, UserUpdateParams } from '../types/user';
import { queryKeys } from './keys';

export type { User, UserUpdateParams } from '../types/user';

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

// The API returns numeric ids; normalize at the boundary so the rest of the
// app can rely on the (string) User.id type.
function normalizeUser(user: User): User {
  return { ...user, id: String(user.id) };
}

// --- Queries -------------------------------------------------------------

export function useUsers(isActive?: boolean): User[] {
  const { data } = useQuery({
    queryKey: queryKeys.users(isActive),
    queryFn: async ({ signal }): Promise<User[]> => {
      const data = await errorHandler({
        promise: get<UsersResult>(usersUrl(isActive), { signal }),
        defaultError: 'USERS_LOADING_FAILED',
      });
      return (data?.users ?? []).map(normalizeUser).sort(byName);
    },
  });
  return data ?? [];
}

export function useUser(id: string): User | undefined {
  const { data } = useQuery({
    queryKey: queryKeys.user(id),
    queryFn: async ({ signal }): Promise<User> => {
      const res = await get<{ user: User }>(`user/${encodeURIComponent(id)}`, {
        signal,
      });
      return normalizeUser(res.user);
    },
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

/** Active/inactive users that aren't soft-disabled. */
export function useFilteredUsers(isActive: boolean): User[] {
  return useUsers(isActive).filter(
    (user) => user.isActive === isActive && user.isDisabled === false
  );
}

// --- Mutations -----------------------------------------------------------

function invalidateUsers() {
  queryClient.invalidateQueries({ queryKey: ['users'] });
  queryClient.invalidateQueries({ queryKey: ['user'] });
}

export async function createUser(name: string): Promise<User | undefined> {
  const data = await errorHandler({
    promise: post<UserResult>('user', { name }),
    defaultError: 'USERS_CREATION_FAILED',
    errors: { UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST' },
  });
  if (data?.user) {
    invalidateUsers();
    return normalizeUser(data.user);
  }
  return undefined;
}

export async function updateUser(
  userId: string,
  params: UserUpdateParams
): Promise<User | undefined> {
  const data = await errorHandler({
    promise: post<UserResult>(`user/${encodeURIComponent(userId)}`, params),
    defaultError: 'USER_EDIT_USER_FAILED',
    errors: { UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST' },
  });
  if (data?.user) {
    queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
    invalidateUsers();
    return normalizeUser(data.user);
  }
  return undefined;
}

// --- Mutation hooks ------------------------------------------------------

export function useCreateUser() {
  return useMutation({
    mutationKey: ['createUser'],
    mutationFn: (name: string) => createUser(name),
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationKey: ['updateUser'],
    mutationFn: ({
      userId,
      params,
    }: {
      userId: string;
      params: UserUpdateParams;
    }) => updateUser(userId, params),
  });
}
