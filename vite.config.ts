import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-expect-error no test support in defineConfig
  test: {
    global: true,
    environment: 'jsdom',
  },
});
