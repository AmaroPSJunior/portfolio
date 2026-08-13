import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['app.spec.js', 'app.spec.jsx', 'app.spec.tsx', 'tests/**/*.spec.{js,jsx,ts,tsx}'],
  },
});

