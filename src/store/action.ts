import { ThunkAction } from '.';
import {
  ArticleActions,
  SettingsActions,
  TransactionActions,
  UserActions,
} from './reducers';

export type Action =
  | UserActions
  | SettingsActions
  | TransactionActions
  | ArticleActions;

export type DefaultThunkAction = ThunkAction<Promise<void>>;
