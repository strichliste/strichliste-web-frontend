// Domain types for the `user` resource. Data fetching/mutations live in
// TanStack Query (see src/queries/users.ts).

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

export interface UserUpdateParams {
  name: string;
  email?: string;
  isDisabled: boolean;
}
