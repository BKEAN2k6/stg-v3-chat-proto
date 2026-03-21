import {enUS, fi, sv} from 'date-fns/locale';
import {SHORT_DOMAIN} from '@/constants.mjs';

export type LanguageCode = 'en' | 'sv' | 'fi';
export type LocaleCode = 'en-US' | 'sv-SE' | 'fi-FI';

export const DEFAULT_LANGUAGE_CODE = 'en';

export const DEFAULT_LOCALE_CODE = 'en-US';

export const SUPPORTED_LOCALE_CODES = ['en-US', 'sv-SE', 'fi-FI'];

export const mapLanguageCodeToLocaleCode: {
  [key in LanguageCode]: LocaleCode;
} = {
  en: 'en-US',
  sv: 'sv-SE',
  fi: 'fi-FI',
};

export const mapLocaleCodeToLanguageCode: {
  [key in LocaleCode]: LanguageCode;
} = {
  'en-US': 'en',
  'sv-SE': 'sv',
  'fi-FI': 'fi',
};

export const mapLocaleCodeToDateFNSLocale = {
  'en-US': enUS,
  'sv-SE': sv,
  'fi-FI': fi,
};

// NOTE: locale comes from cookies. Since cookies are fetched differently for
// client and server components, we manage that from where this function is
// called. This is just a wrapper to return the default if we don't have the
// cookie set.
export const getLocaleCode = (localeCode?: string) => {
  if (localeCode && SUPPORTED_LOCALE_CODES.includes(localeCode)) {
    return localeCode as LocaleCode;
  }

  return DEFAULT_LOCALE_CODE;
};

export const getLanguageDomain = (
  includeProtocol?: boolean,
  lang?: LanguageCode,
) => {
  const isLocal = process.env.NODE_ENV === 'development';

  const languageDomain = `${lang}.${SHORT_DOMAIN}`;

  if (includeProtocol) {
    return isLocal ? 'http://' + languageDomain : 'https://' + languageDomain;
  }

  return languageDomain;
};

type TransformedTranslations = Record<string, Record<LocaleCode, string>>;

export const transformTranslations = (
  translations: Array<Record<string, string>>,
) => {
  // Initialize the result object
  const result: TransformedTranslations = {};
  // Iterate over each translation object
  for (const translation of translations) {
    // Iterate over each key in the translation object
    for (const [key, value] of Object.entries(translation)) {
      if (key === 'language_code') continue;
      // If the result does not already have this key, initialize it as an empty object
      if (!result[key]) {
        result[key] = {'fi-FI': '', 'en-US': '', 'sv-SE': ''};
      }

      // Assign the value to the result using the language_code as key
      result[key][translation.language_code as LocaleCode] = value;
    }
  }

  return result;
};
