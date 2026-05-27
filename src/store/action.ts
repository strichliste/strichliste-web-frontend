import {
  ErrorActions,
  LoaderActions,
  SearchActions,
  TransactionActions,
  UserActions,
} from './reducers';

export type Action =
  | ErrorActions
  | LoaderActions
  | SearchActions
  | TransactionActions
  | UserActions;
