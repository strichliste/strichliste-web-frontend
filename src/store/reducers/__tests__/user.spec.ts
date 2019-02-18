// tslint:disable no-any
import { DeepPartial } from 'redux';
import { user } from '..';
import { get, post } from '../../../services/api';
import { getMockStore } from '../../../spec-configs/mock-store';
import { Action } from '../../action';
import { transactionsLoaded } from '../transaction';
import {
  UserActionTypes,
  getUser,
  getUserArray,
  getUserTransactionsArray,
  startCreatingUser,
  startLoadingUserDetails,
  startLoadingUsers,
  startUpdateUser,
  userDetailsLoaded,
} from '../user';

jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('user reducer', () => {
  let action: DeepPartial<Action>;

  describe('with non matching action', () => {
    it('returns initial state', () => {
      const initialState = {};
      expect(user(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('with a UsersLoaded action', () => {
    const usersResponse = {
      users: [
        {
          id: 1,
          name: 'schinken',
          isActive: true,
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
          isActive: true,
          email: null,
          balance: 12330,
          created: '2018-08-18 16:18:40',
        },
      };
      const result = user(undefined, action as Action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('with a UserDetailsLoaded action', () => {
    it('adds the user to the state', () => {
      action = userDetailsLoaded({
        id: 1,
        name: 'schinken',
        isActive: true,
        balance: 12330,
        created: '2018-08-18 16:18:40',
      });
      const expectedResult = {
        1: {
          id: 1,
          name: 'schinken',
          isActive: true,
          balance: 12330,
          created: '2018-08-18 16:18:40',
        },
      };
      const result = user(undefined, action as Action);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('with a TransactionsLoaded action', () => {
    describe('and a matching user', () => {
      it('updates transactions for this user', () => {
        action = transactionsLoaded([{ id: 1, user: { id: 'user1' } }] as any);
        const result = user(
          { user1: { id: 'user1', transactions: { 2: 2 } } } as any,
          action as Action
        );
        const expectedResult = {
          user1: { id: 'user1', transactions: { 1: 1, 2: 2 } },
        };
        expect(result).toEqual(expectedResult);
      });
    });
    describe('without a matching user', () => {
      it('sets transaction and user of the response', () => {
        action = transactionsLoaded([{ id: 1, user: { id: 'user1' } }] as any);
        const result = user(undefined, action as Action);
        const expectedResult = {
          user1: { id: 'user1', transactions: { 1: 1 } },
        };
        expect(result).toEqual(expectedResult);
      });
    });
    describe('with an empty transaction', () => {
      it('wont throw an exception', () => {
        action = transactionsLoaded([] as any);
        const result = user(undefined, action as Action);
        expect(result).toEqual(result);
      });
    });
  });
});

describe('action creators', () => {
  describe('startLoadingUsers', () => {
    it('triggers usersLoaded on success', async () => {
      (get as any).mockImplementationOnce(() => Promise.resolve([{ id: 1 }]));

      const store = getMockStore();
      await store.dispatch(startLoadingUsers(true));
      expect(get).toHaveBeenCalledWith('user?deleted=false&active=true');
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('startLoadingUserDetails', () => {
    it('triggers userDetailsLoaded on success', async () => {
      (get as any).mockImplementationOnce(() =>
        Promise.resolve({ user: [{ id: 1 }] })
      );

      const store = getMockStore();
      await store.dispatch(startLoadingUserDetails(1));
      expect(get).toHaveBeenCalledWith('user/1');
      expect(store.getActions()).toEqual([
        userDetailsLoaded([{ id: 1 }] as any),
      ]);
    });
  });

  describe('startCreatingUser', () => {
    it('triggers userDetailsLoaded on success', async () => {
      (post as any).mockImplementationOnce(() =>
        Promise.resolve({ user: [{ id: 1 }] })
      );
      const store = getMockStore();
      await startCreatingUser(store.dispatch, 'test');
      expect(post).toHaveBeenCalledWith('user', { name: 'test' });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('startUpdateUser', () => {
    it('triggers userDetailsLoaded on success', async () => {
      (post as any).mockImplementationOnce(() =>
        Promise.resolve({ user: [{ id: 1 }] })
      );
      const store = getMockStore();
      await store.dispatch(
        startUpdateUser(1, { name: 'test', isDisabled: true })
      );
      expect(post).toHaveBeenCalledWith('user/1', {
        name: 'test',
        isDisabled: true,
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});

describe('selectors', () => {
  describe('getUserArray', () => {
    it('returns the current user map as an array', () => {
      expect(
        getUserArray({
          user: { 1: { id: 1, name: 'a' }, 2: { id: 2, name: 'b' } },
        } as any)
      ).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
    });
  });
  describe('getUser', () => {
    it('selects a user by id', () => {
      expect(
        getUser(
          {
            user: { 1: { id: 1 }, 2: { id: 2 } },
          } as any,
          2
        )
      ).toEqual({ id: 2 });
    });
  });
  describe('getUserTransactionsArray', () => {
    describe('with no user', () => {
      it('returns an empty array', () => {
        expect(
          getUserTransactionsArray(
            { user: { 1: { id: 1 }, 2: { id: 2 } } } as any,
            4
          )
        ).toEqual([]);
      });
    });
    describe('with no transactions', () => {
      it('returns an empty array', () => {
        expect(
          getUserTransactionsArray(
            { user: { 1: { id: 1 }, 2: { id: 2 } } } as any,
            2
          )
        ).toEqual([]);
      });
    });
    describe('with transactions set', () => {
      it('selects all user transactions as an array sorted desc by id', () => {
        expect(
          getUserTransactionsArray(
            {
              user: {
                1: { id: 1 },
                2: { id: 2, transactions: { 2: 2, 3: 3, 1: 1, 8: 8 } },
              },
            } as any,
            2
          )
        ).toEqual([8, 3, 2, 1]);
      });
    });
  });
});
