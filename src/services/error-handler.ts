import { setGlobalError } from './global-error';

export interface MaybeResponse {
  error?: {
    class: string;
  };
}

export interface ErrorConfig<Result> {
  errors?: Record<string, string>;
  defaultError?: string;
  promise: Promise<Result>;
}

function handleApiError<Result>(
  config: ErrorConfig<Result>,
  error: { class: string }
): void {
  const [key] = Object.keys(config.errors || {}).filter((key) =>
    error.class.includes(key)
  );

  if (key && config.errors && config.errors[key]) {
    setGlobalError(config.errors[key]);
  } else {
    setGlobalError(config.defaultError || '');
  }
}

/**
 * Awaits an API promise, surfaces failures through the global error banner,
 * and returns the typed response (or `undefined` on error). Callers in
 * `src/queries/*` use this to keep the user-facing error UX consistent.
 */
export async function errorHandler<Result extends MaybeResponse>(
  config: ErrorConfig<Result>
): Promise<Result | undefined> {
  const { promise, defaultError = '' } = config;
  setGlobalError('');
  try {
    const data = await promise;
    if (data.error) {
      handleApiError(config, data.error);
      return undefined;
    }
    return data;
  } catch {
    setGlobalError(defaultError);
    return undefined;
  }
}
