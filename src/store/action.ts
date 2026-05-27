import {
  ArticleActions,
  ErrorActions,
  LoaderActions,
  SearchActions,
  TransactionActions,
  UserActions,
} from './reducers';

export type Action =
  | ArticleActions
  | ErrorActions
  | LoaderActions
  | SearchActions
  | TransactionActions
  | UserActions;
