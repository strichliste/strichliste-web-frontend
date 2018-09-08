import { Action } from '../action';
import { AppState } from '../store';

export enum ErrorTypes {
  SetError = 'SET_ERROR',
  GlobalError = 'GLOBAL_ERROR',
}

export interface SetError {
  type: ErrorTypes.SetError;
  payload: Error;
}

export function setError(payload: Error): SetError {
  return {
    type: ErrorTypes.SetError,
    payload,
  };
}

export function setGlobalError(payload: string): SetError {
  return setError({ [ErrorTypes.GlobalError]: payload });
}

export type ErrorActions = SetError;

interface Error {
  [key: string]: string;
}

const initialState: Error = {};

export function error(state: Error = initialState, action: Action): Error {
  switch (action.type) {
    case ErrorTypes.SetError:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function getError(state: AppState): Error {
  return state.error;
}

export function getGlobalError(state: AppState): string {
  const error = getError(state);

  return error[ErrorTypes.GlobalError] ? error[ErrorTypes.GlobalError] : '';
}
