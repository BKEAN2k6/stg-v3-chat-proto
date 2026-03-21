import type {FlatXoConfig} from 'xo';

const frontendDir = import.meta.dirname;
const rootDir = `${frontendDir}/..`;

const config: FlatXoConfig = [
  {
    ignores: ['src/languages'],
  },
  {
    react: true,
    space: true,
    prettier: true,
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'unicorn/filename-case': [
        'error',
        {cases: {pascalCase: true, camelCase: true, kebabCase: true}},
      ],
      'capitalized-comments': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {packageDir: [frontendDir, rootDir]},
      ],
      'n/no-extraneous-import': 'off',
    },
  },
  {
    files: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {packageDir: [frontendDir, rootDir]},
      ],
      'n/no-extraneous-import': 'off',
    },
  },
  {
    files: ['vite.config.ts', 'xo.config.ts', 'vitest.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: './tsconfig.node.json',
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {packageDir: [frontendDir, rootDir]},
      ],
      'n/no-extraneous-import': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'unicorn/relative-url-style': 'off',
    },
  },
];

export default config;
