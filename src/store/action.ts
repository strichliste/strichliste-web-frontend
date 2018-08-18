import { ThunkAction } from '.';
import { UserActions } from './reducers';
import { SettingsActions } from './reducers/settings';

export type Action = UserActions | SettingsActions;

export type DefaultThunkAction = ThunkAction<Promise<void>>;
