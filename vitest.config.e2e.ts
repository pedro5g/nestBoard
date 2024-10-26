import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    setupFiles: ['./test/setup.e2e.ts'],
    root: './',
  },

  plugins: [tsConfigPaths(), swc.vite()],
});
