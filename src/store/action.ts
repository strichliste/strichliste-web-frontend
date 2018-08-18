import { ThunkAction } from '.';
import { UserActions } from './reducers';

export type Action = UserActions;

export type DefaultThunkAction = ThunkAction<Promise<void>>;
