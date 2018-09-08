import { ThunkAction } from '.';
import {
  ArticleActions,
  ErrorActions,
  LoaderActions,
  SettingsActions,
  TransactionActions,
  UserActions,
} from './reducers';

export type Action =
  | ArticleActions
  | ErrorActions
  | LoaderActions
  | SettingsActions
  | TransactionActions
  | UserActions;

export type DefaultThunkAction = ThunkAction<Promise<void>>;
