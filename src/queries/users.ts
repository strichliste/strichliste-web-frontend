import { useMutation, useQuery } from '@tanstack/react-query';

import { get, post } from '../services/api';
import { MaybeResponse, throwOnBodyError } from '../services/error-handler';
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
      const res = await get<UsersResult>(usersUrl(isActive), { signal });
      return (res.users ?? []).map(normalizeUser).sort(byName);
    },
    meta: { defaultError: 'USERS_LOADING_FAILED' },
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
    // Intentionally no meta.defaultError: per-user fetches are noisy (every
    // detail page mount fires one) and we don't want stale per-user errors
    // taking over the global toast while the user navigates.
  });
  return data;
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
  // Two prefixes: `['users', …]` is the list view, `['user', id, …]` is the
  // per-user detail/metrics. After a write we don't know which detail page is
  // mounted, so we invalidate both prefixes broadly.
  queryClient.invalidateQueries({ queryKey: ['users'] });
  queryClient.invalidateQueries({ queryKey: ['user'] });
}

async function createUser(name: string): Promise<User> {
  const res = throwOnBodyError(await post<UserResult>('user', { name }));
  invalidateUsers();
  return normalizeUser(res.user);
}

async function updateUser(
  userId: string,
  params: UserUpdateParams
): Promise<User> {
  const res = throwOnBodyError(
    await post<UserResult>(`user/${encodeURIComponent(userId)}`, params)
  );
  queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
  invalidateUsers();
  return normalizeUser(res.user);
}

// --- Mutation hooks ------------------------------------------------------

export function useCreateUser() {
  return useMutation({
    mutationFn: (name: string) => createUser(name),
    meta: {
      defaultError: 'USERS_CREATION_FAILED',
      errors: { UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST' },
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({
      userId,
      params,
    }: {
      userId: string;
      params: UserUpdateParams;
    }) => updateUser(userId, params),
    meta: {
      defaultError: 'USER_EDIT_USER_FAILED',
      errors: { UserAlreadyExistsException: 'USERS_CREATION_FAILED_USER_EXIST' },
    },
  });
}
