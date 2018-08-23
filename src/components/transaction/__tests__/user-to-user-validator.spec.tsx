import * as React from 'react';
import { cleanup } from 'react-testing-library';
import { renderWithContext } from '../../../spec-configs/render';

import { ConnectedUserToUserValidator } from '../user-to-user-validator';

afterEach(cleanup);

describe('UserToUserValidator', () => {
  it('returns true if the user has the money  and the receiver can accept it', () => {
    const { getByTestId } = renderWithContext(
      <ConnectedUserToUserValidator
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

  it('returns false if the user does not hav the money', () => {
    const { getByTestId } = renderWithContext(
      <ConnectedUserToUserValidator
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
        userId={1}
        targetUserId={2}
        value={100}
      />,
      {
        user: { 1: { balance: -19900 }, 2: { balance: 100 } },
      }
    );

    expect(getByTestId('result').innerHTML).toBe('no');
  });

  it('returns false if the receiver can not accept the money', () => {
    const { getByTestId } = renderWithContext(
      <ConnectedUserToUserValidator
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
        userId={1}
        targetUserId={2}
        value={100}
      />,
      {
        user: { 1: { balance: 400 }, 2: { balance: 19900 } },
      }
    );

    expect(getByTestId('result').innerHTML).toBe('no');
  });
});
