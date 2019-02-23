import * as React from 'react';
import { cleanup } from 'react-testing-library';

import {
  createConnectedComponent,
  getMockStore,
} from '../../../spec-configs/mock-store';
import { renderWithContext } from '../../../spec-configs/render';
import { CreateCustomTransactionForm } from '../create-custom-transaction-form';

afterEach(cleanup);

describe('CreateCustomTransactionForm', () => {
  it('matches the snapshot', () => {
    const store = getMockStore({});
    const Component = createConnectedComponent(CreateCustomTransactionForm);
    const { container } = renderWithContext(
      <Component userId={12} store={store} />,
      { user: { 12: { balance: 0 } } }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
