import path from 'node:path';
import process from 'node:process';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {lingui} from '@lingui/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import {config} from 'dotenv';

config();

// https://vitejs.dev/config/
export default defineConfig({
  base: '/stg-v3-chat-proto/',
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    UI_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['global-builtin', 'import', 'color-functions'],
        // eslint-disable-next-line unicorn/prefer-module
        loadPaths: [path.resolve(__dirname, '../node_modules')],
      },
    },
  },
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      '@': path.resolve(__dirname, 'src'),
      // eslint-disable-next-line unicorn/prefer-module
      '@client': path.resolve(__dirname, '../backend/src/api/client'),
      // eslint-disable-next-line unicorn/prefer-module
      '@shared': path.resolve(__dirname, '../backend/src/shared'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/analytics': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
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
