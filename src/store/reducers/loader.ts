import { Action } from '../action';
import { AppState } from '../store';

export enum LoaderTypes {
  SetLoader = 'SET_LOADER',
  GlobalLoader = 'GLOBAL_LOADER',
}

export interface SetLoader {
  type: LoaderTypes.SetLoader;
  payload: Loader;
}

export function setLoader(payload: Loader): SetLoader {
  return {
    type: LoaderTypes.SetLoader,
    payload,
  };
}

export function setGlobalLoader(payload: boolean): SetLoader {
  return setLoader({ [LoaderTypes.GlobalLoader]: payload });
}

export type LoaderActions = SetLoader;

interface Loader {
  [key: string]: boolean;
}

const initialState: Loader = {};

export function loader(state: Loader = initialState, action: Action): Loader {
  switch (action.type) {
    case LoaderTypes.SetLoader:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function getLoader(state: AppState): Loader {
  return state.loader;
}

export function getGlobalLoader(state: AppState): boolean {
  const loader = getLoader(state);

  return loader[LoaderTypes.GlobalLoader]
    ? loader[LoaderTypes.GlobalLoader]
    : false;
}
