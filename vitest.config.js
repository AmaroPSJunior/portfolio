import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['app.spec.js', 'tests/**/*.spec.js'],
  },
});
