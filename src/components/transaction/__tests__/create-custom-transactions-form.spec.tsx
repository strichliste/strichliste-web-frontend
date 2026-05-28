import { cleanup } from '@testing-library/react';

import { renderWithContext } from '../../../spec-configs/render';
import { CreateCustomTransactionForm } from '../create-custom-transaction-form';

afterEach(cleanup);

describe('CreateCustomTransactionForm', () => {
  it('matches the snapshot', () => {
    const { container } = renderWithContext(<CreateCustomTransactionForm userId="12" />, { users: { '12': { balance: 0 } } }
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
