import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: ['./src/test-utils/globalMongo.ts'],
    setupFiles: ['./src/test-utils/mongooseCleanup.ts'],

    hookTimeout: 60_000,
    pool: 'threads',
    poolOptions: {
      threads: {singleThread: true},
    },
    isolate: false,
  },
});
