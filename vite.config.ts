/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import tsconfig from './tsconfig-base.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      ...Object.entries(tsconfig.compilerOptions.paths).map(([k, v]) => ({
        find: k,
        replacement: path.resolve(__dirname, v[0]),
      })),
    ],
  },
  test: {
    environment: 'jsdom',
  },
});
