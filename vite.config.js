import { defineConfig } from 'vite';

export default defineConfig({
  root: '__test__/browser',
  server: { port: 1234 },
  build: { outDir: './dist' },
});