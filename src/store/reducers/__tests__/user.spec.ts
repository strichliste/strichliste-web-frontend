import { DeepPartial } from 'redux';

import { user } from '..';
import { Action } from '../../action';
import { UserActionTypes } from '../user';

describe('user reducer', () => {
  let action: DeepPartial<Action>;

  describe('with non matching action', () => {
    it('returns initial state', () => {
      const initialState = {};
      // tslint:disable-next-line no-any
      expect(user(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('with a UsersLoaded action', () => {
    const usersResponse = {
      users: [
        {
          id: 1,
          name: 'schinken',
          active: true,
          email: null,
          balance: 12330,
          created: '2018-08-18 16:18:40',
        },
      ],
    };
    beforeEach(() => {
      action = {
        type: UserActionTypes.UsersLoaded,
        payload: usersResponse,
      };
    });

    it('creates a new user entry in the store', () => {
      const expectedResult = {
        1: {
          id: 1,
          name: 'schinken',
          active: true,
          email: null,
          balance: 12330,
          created: '2018-08-18 16:18:40',
        },
      };
      const result = user(undefined, action as Action);
      expect(result).toEqual(expectedResult);
    });
  });
});
