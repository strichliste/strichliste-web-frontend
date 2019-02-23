import {
  ArticleActions,
  ErrorActions,
  LoaderActions,
  SearchActions,
  SettingsActions,
  TransactionActions,
  UserActions,
} from './reducers';

export type Action =
  | ArticleActions
  | ErrorActions
  | LoaderActions
  | SettingsActions
  | SearchActions
  | TransactionActions
  | UserActions;
