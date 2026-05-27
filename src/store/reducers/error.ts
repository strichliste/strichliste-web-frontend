import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

export enum ErrorTypes {
  SetError = 'SET_ERROR',
  GlobalError = 'GLOBAL_ERROR',
}

interface Error {
  [key: string]: string;
}

const initialState: Error = {};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<Error>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setError } = errorSlice.actions;
export const error = errorSlice.reducer;
export type ErrorActions = ReturnType<typeof setError>;

export function setGlobalError(payload: string) {
  return setError({ [ErrorTypes.GlobalError]: payload });
}

export function getError(state: AppState): Error {
  return state.error;
}

export function getGlobalError(state: AppState): string {
  const error = getError(state);

  return error[ErrorTypes.GlobalError] ? error[ErrorTypes.GlobalError] : '';
}
