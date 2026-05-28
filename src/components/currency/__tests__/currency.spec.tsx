import { cleanup } from '@testing-library/react';

import { Currency } from '../';
import { renderWithContext } from '../../../spec-configs/render';

afterEach(cleanup);

describe('Currency', () => {
  it('matches the snapshot for english locales', () => {
    const { container } = renderWithContext(<Currency value={120} />);
    expect(container).toMatchSnapshot();
  });
  it('hides plus icons by prop', () => {
    const { container } = renderWithContext(<Currency hidePlusSign value={120} />);
    expect(container).toMatchSnapshot();
  });
  it('show - icons', () => {
    const { container } = renderWithContext(<Currency hidePlusSign value={-120} />);
    expect(container).toMatchSnapshot();
  });
});
