import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

export enum LoaderTypes {
  SetLoader = 'SET_LOADER',
  GlobalLoader = 'GLOBAL_LOADER',
}

interface Loader {
  [key: string]: boolean;
}

const initialState: Loader = {};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<Loader>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setLoader } = loaderSlice.actions;
export const loader = loaderSlice.reducer;
export type LoaderActions = ReturnType<typeof setLoader>;

export function setGlobalLoader(payload: boolean) {
  return setLoader({ [LoaderTypes.GlobalLoader]: payload });
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
