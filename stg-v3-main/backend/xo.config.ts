import type {FlatXoConfig} from 'xo';

const backendDir = import.meta.dirname;
const rootDir = `${backendDir}/..`;

const config: FlatXoConfig = [
  {
    ignores: [
      'ecosystem.config.js',
      'jest-mongodb-config.js',
      'jest.config.js',
      'vitest.config.ts',
    ],
  },
  {
    space: true,
    prettier: true,
    rules: {
      'import/extensions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'unicorn/filename-case': [
        'error',
        {cases: {pascalCase: true, camelCase: true}},
      ],
      'max-depth': ['error', 10],
      'no-console': 'warn',
      'import/no-cycle': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {packageDir: [backendDir, rootDir]},
      ],
      'n/no-extraneous-import': 'off',
    },
  },
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test-utils/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {packageDir: [backendDir, rootDir]},
      ],
      'n/no-extraneous-import': 'off',
    },
  },
  {
    files: ['xo.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: './tsconfig.node.json',
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {packageDir: [backendDir, rootDir]},
      ],
      'n/no-extraneous-import': 'off',
    },
  },
  {
    files: ['src/api/client/ApiTypes.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];

export default config;
