import { ThunkAction } from '.';
import { SettingsActions, TransactionActions, UserActions } from './reducers';

export type Action = UserActions | SettingsActions | TransactionActions;

export type DefaultThunkAction = ThunkAction<Promise<void>>;
