import type {LinguiConfig} from '@lingui/conf';

const config: LinguiConfig = {
  locales: ['en', 'fi', 'sv'],
  compileNamespace: 'es',
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/languages/{locale}',
      include: ['src'],
    },
  ],
  format: 'po',
  service: {
    name: 'TranslationIO',
    apiKey: 'cbaf68137dff43d2a24b2f4d710d1b1a',
  },
};

export default config;
