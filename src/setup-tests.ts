import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// React Testing Library does not auto-clean up under Vitest, mirror the
// behaviour the suite relied on under CRA/Jest.
afterEach(() => {
  cleanup();
});
