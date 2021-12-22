import * as React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithContext } from '../../../spec-configs/render';

import { UserToUserValidator } from '../user-to-user-validator';

afterEach(cleanup);

describe('UserToUserValidator', () => {
  it('returns true if the user has the money  and the receiver can accept it', () => {
    const { getByTestId } = renderWithContext(
      <UserToUserValidator
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
        userId={1}
        targetUserId={2}
        value={100}
      />,
      {
        user: { 1: { balance: 100 }, 2: { balance: 100 } },
      }
    );

    expect(getByTestId('result').innerHTML).toBe('yes');
  });

  it('returns false if the user does not have the money', () => {
    const { getByTestId } = renderWithContext(
      <UserToUserValidator
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
        userId={1}
        targetUserId={2}
        value={100}
      />,
      {
        user: { 1: { balance: -250000 }, 2: { balance: 100 } },
      }
    );
    expect(getByTestId('result').innerHTML).toBe('no');
  });

  it('returns false if the receiver can not accept the money', () => {
    const { getByTestId } = renderWithContext(
      <UserToUserValidator
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
        userId={1}
        targetUserId={2}
        value={100}
      />,
      {
        user: { 1: { balance: 400 }, 2: { balance: 19999 } },
      }
    );

    expect(getByTestId('result').innerHTML).toBe('no');
  });
});
