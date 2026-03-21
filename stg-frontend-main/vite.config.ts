import path from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {lingui} from '@lingui/vite-plugin';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['macros'],
      },
    }),
    lingui(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention, unicorn/prefer-module
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // NOTE: these are for the dev server only. See nginx/nginx.*.conf for how this is done in the deployments.
    proxy: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '/socket.io/': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/stg-backend-development': {
        target: 'http://localhost:4568',
        changeOrigin: true,
      },
    },
  },
});
