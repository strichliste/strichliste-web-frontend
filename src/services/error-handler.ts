import { ApiError } from './api';

export interface MaybeResponse {
  error?: {
    class: string;
  };
}

/**
 * Map known `error.class` values to a localized message id. The lookup is
 * exact (against both the full class string and its short name, to tolerate
 * PHP-style FQCNs like `App\Foo\UserAlreadyExistsException`).
 */
export type ErrorClassMap = Record<string, string>;

export function shortClass(errorClass: string): string {
  const parts = errorClass.split(/[\\.]/);
  return parts[parts.length - 1] ?? errorClass;
}

/**
 * Given an `errorClass` string and a map of `errorClass -> messageId`, pick
 * the best matching message id. Tries the FQCN first, then the short class
 * name, then `fallback`.
 */
export function pickErrorMessage(
  errorClass: string | undefined,
  errors: ErrorClassMap | undefined,
  fallback: string | undefined
): string | undefined {
  if (!errorClass || !errors) return fallback;
  return errors[errorClass] ?? errors[shortClass(errorClass)] ?? fallback;
}

/**
 * Some backend endpoints return HTTP 200 with `{ error: { class: '…' } }` in
 * the body to signal an application-level rejection (the transport succeeded
 * but the operation didn't). Mutation helpers call this immediately after a
 * successful POST/DELETE to turn that body shape into a thrown `ApiError`, so
 * `MutationCache.onError` and `useMutation`'s native `isError`/`onError` see
 * the failure on a single path.
 */
export function throwOnBodyError<T extends MaybeResponse>(data: T): T {
  if (data && data.error) {
    throw new ApiError(200, '', data, undefined, data.error.class);
  }
  return data;
}
