/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Hash-based routing is used, so the app can be served from any sub-path.
  base: './',
  // Expose env vars starting with `API` (e.g. `API`) to the client bundle.
  // Vite defaults to `VITE_`; we override so the operator-facing variable
  // is just `API` instead of the framework-prefixed name.
  envPrefix: 'API',
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup-tests.ts',
    css: true,
    // Playwright specs live under e2e/ and are run by @playwright/test, not Vitest.
    exclude: ['**/node_modules/**', '**/build/**', '**/e2e/**'],
  },
});
