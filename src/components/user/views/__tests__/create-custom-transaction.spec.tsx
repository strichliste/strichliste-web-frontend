// tslint:disable:no-any

import * as React from 'react';
import { cleanup } from 'react-testing-library';

import { renderWithContext } from '../../../../spec-configs/render';
import { CreateCustomTransaction } from '../create-custom-transaction';

afterEach(cleanup);

const mock: any = jest.fn();

describe('CreateCustomTransaction', () => {
  describe('with deposit', () => {
    it('matches the snapshot', () => {
      const { container } = renderWithContext(
        <CreateCustomTransaction
          history={mock}
          match={{ params: { id: 5, deposit: 'deposit' } } as any}
          location={mock}
        />,
        { user: { 5: { balance: 0 } } }
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('with dispense', () => {
    it('matches the snapshot', () => {
      const { container } = renderWithContext(
        <CreateCustomTransaction
          history={mock}
          match={{ params: { id: 5, deposit: 'dispense' } } as any}
          location={mock}
        />,
        { user: { 5: { balance: 0 } } }
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
