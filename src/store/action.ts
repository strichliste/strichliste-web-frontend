import { ErrorActions, LoaderActions, SearchActions } from './reducers';

export type Action = ErrorActions | LoaderActions | SearchActions;
