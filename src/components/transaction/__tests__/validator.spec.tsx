import * as React from 'react';
import { cleanup, render } from 'react-testing-library';

import { Boundary } from '../../../store/reducers';
import { TransactionValidator } from '../validator';

afterEach(cleanup);

describe('TransactionValidator', () => {
  it('is valid for deposit in boundary', () => {
    const boundary: Boundary = {
      upper: 100,
      lower: -50,
    };

    const { getByTestId } = render(
      <TransactionValidator
        balance={10}
        boundary={boundary}
        value={10}
        isDeposit={true}
        userId={1}
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
      />
    );
    expect(getByTestId('result').textContent).toEqual('yes');
  });

  it('is valid for dispense in boundary', () => {
    const boundary: Boundary = {
      upper: 100,
      lower: -50,
    };

    const { getByTestId } = render(
      <TransactionValidator
        balance={10}
        boundary={boundary}
        value={10}
        isDeposit={false}
        userId={1}
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
      />
    );
    expect(getByTestId('result').textContent).toEqual('yes');
  });

  it('is inValid for deposit out of boundary', () => {
    const boundary: Boundary = {
      upper: 100,
      lower: -50,
    };

    const { getByTestId } = render(
      <TransactionValidator
        balance={90}
        boundary={boundary}
        value={10}
        isDeposit={true}
        userId={1}
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
      />
    );
    expect(getByTestId('result').textContent).toEqual('no');
  });

  it('is valid for dispense out of boundary', () => {
    const boundary: Boundary = {
      upper: 100,
      lower: -50,
    };

    const { getByTestId } = render(
      <TransactionValidator
        balance={-50}
        boundary={boundary}
        value={10}
        isDeposit={false}
        userId={1}
        render={isValid => (
          <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
        )}
      />
    );
    expect(getByTestId('result').textContent).toEqual('no');
  });
});
