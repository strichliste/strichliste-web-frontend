/**
 * Recursive partial. redux 5 removed its `DeepPartial` export; this replaces it
 * for the test fixtures and store helpers that relied on it.
 */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
