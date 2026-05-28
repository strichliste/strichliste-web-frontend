import { setGlobalError } from './global-error';

export interface MaybeResponse {
  error?: {
    class: string;
  };
}

export interface ErrorConfig<Result> {
  /**
   * Map known `error.class` values to a localized message id. The lookup is
   * exact (against both the full class string and its short name, to tolerate
   * PHP-style FQCNs like `App\Foo\UserAlreadyExistsException`).
   */
  errors?: Record<string, string>;
  defaultError?: string;
  promise: Promise<Result>;
}

function shortClass(errorClass: string): string {
  const parts = errorClass.split(/[\\.]/);
  return parts[parts.length - 1] ?? errorClass;
}

function pickErrorMessage<Result>(
  config: ErrorConfig<Result>,
  errorClass: string
): string {
  const map = config.errors ?? {};
  return (
    map[errorClass] ?? map[shortClass(errorClass)] ?? config.defaultError ?? ''
  );
}

/**
 * Awaits an API promise, surfaces failures through the global error banner,
 * and returns the typed response (or `undefined` on error). Callers in
 * `src/queries/*` use this to keep the user-facing error UX consistent.
 *
 * The function intentionally does **not** clear the global error on entry —
 * that would let a successful concurrent request hide a pending failure.
 * Callers (or `ErrorMessage`'s fade-out) own clearing.
 */
export async function errorHandler<Result extends MaybeResponse>(
  config: ErrorConfig<Result>
): Promise<Result | undefined> {
  const { promise, defaultError = '' } = config;
  try {
    const data = await promise;
    if (data && data.error) {
      setGlobalError(pickErrorMessage(config, data.error.class));
      return undefined;
    }
    return data;
  } catch {
    // Includes ApiError thrown by `services/api.ts` for non-2xx responses,
    // and any network/abort failure.
    setGlobalError(defaultError);
    return undefined;
  }
}
