/**
 * Recursive partial used in test fixtures and helpers.
 */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export * from './user';
export * from './article';
export * from './transaction';
export * from './settings';
