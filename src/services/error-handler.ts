import { Dispatch } from '../store';
import { LoaderTypes, setGlobalError, setLoader } from '../store/reducers';

export interface Response {
  error?: {
    class: string;
  };
}

export interface ErrorConfig<Result> {
  loader?: LoaderTypes;
  errors?: {};
  defaultError?: string;
  promise: Promise<Result>;
}
export async function errorHandler<Result extends Response>(
  dispatch: Dispatch,
  config: ErrorConfig<Result>
): Promise<Result | undefined> {
  const {
    loader = LoaderTypes.GlobalLoader,
    promise,
    defaultError = '',
  } = config;
  dispatch(setLoader({ [loader]: true }));
  dispatch(setGlobalError(''));
  try {
    const data = await promise;
    dispatch(setLoader({ [loader]: false }));
    if (data.error) {
      handleApiError(dispatch, config, data.error);
      return undefined;
    } else {
      return data;
    }
  } catch (e) {
    dispatch(setGlobalError(defaultError));
    dispatch(setLoader({ [loader]: false }));
    return undefined;
  }
}

function handleApiError(
  dispatch: Dispatch,
  // tslint:disable-next-line:no-any
  config: ErrorConfig<any>,
  error: { class: string }
): void {
  const [key] = Object.keys(config.errors || {}).filter(key =>
    error.class.indexOf(key)
  );

  if (key && config.errors && config.errors[key]) {
    dispatch(setGlobalError(config.errors[key]));
  } else {
    dispatch(setGlobalError(config.defaultError || ''));
  }
}
