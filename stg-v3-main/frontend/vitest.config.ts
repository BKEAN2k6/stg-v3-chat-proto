import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '@client/': new URL('../backend/src/api/client/', import.meta.url)
        .pathname,
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
