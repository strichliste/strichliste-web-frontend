import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests run the real app in a browser against the live demo backend
 * at https://demo.strichliste.org/api/ (configured via VITE_API in
 * .env.development, which the dev server picks up).
 *
 * The demo API is shared and stateful, so tests create their own uniquely named
 * data and avoid assumptions about global state.
 */
const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Serve the production build (fast, no on-demand dev compilation) pointed at
  // the demo API. This is faithful to what actually ships and avoids dev-server
  // cold-start flakiness.
  webServer: {
    command: 'npm run build && npm run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      VITE_API: 'https://demo.strichliste.org/api/',
    },
  },
});
