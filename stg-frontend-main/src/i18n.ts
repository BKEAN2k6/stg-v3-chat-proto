import {i18n} from '@lingui/core';

export const languages = {
  en: 'English',
  fi: 'Suomi',
  sv: 'Svenska',
};

export type LanguageCode = keyof typeof languages;

export const defaultLanguage = 'en';

export async function dynamicActivate(language: string) {
  const {messages} = await import(`./languages/${language}.mjs`); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  i18n.load(language, messages); // eslint-disable-line @typescript-eslint/no-unsafe-argument
  i18n.activate(language);
}
