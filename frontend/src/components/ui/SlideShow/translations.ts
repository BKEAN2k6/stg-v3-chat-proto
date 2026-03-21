import {type LanguageCode} from '@client/ApiTypes.js';

export const markAsReadTranslations: Record<LanguageCode, string> = {
  en: 'Collect trophy',
  fi: 'Kerää pokaali',
  sv: 'Samla trofén',
};

export const markAsReadQuestionTranslations: Record<LanguageCode, string> = {
  en: 'Collect this trophy before exiting?',
  fi: 'Kerätäänkö pokaali ennen sulkemista?',
  sv: 'Samla trofén innan du avslutar?',
};

export const markAsReadCancelTranslations: Record<LanguageCode, string> = {
  en: 'Maybe later',
  fi: 'Ehkä myöhemmin',
  sv: 'Kanske senare',
};
