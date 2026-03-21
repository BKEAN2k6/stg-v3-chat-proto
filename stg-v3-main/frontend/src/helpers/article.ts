import {
  type LanguageCode,
  type AgeGroup,
  type ArticleChapter,
} from '@client/ApiTypes';

export const ageGroups: AgeGroup[] = [
  'preschool',
  '7-8',
  '9-10',
  '11-12',
  '13-15',
] as const;

export const articleChapters: ArticleChapter[] = [
  'start',
  'speak',
  'act',
  'assess',
] as const;

export const ageGroupsTranslationMap: Record<
  AgeGroup,
  Record<LanguageCode, string>
> = {
  preschool: {
    fi: 'Varhaiskasvatus',
    en: 'Preschool',
    sv: 'Förskola',
  },
  '7-8': {
    fi: 'Luokat 1 - 2',
    en: 'Class 1 - 2',
    sv: 'Klass 1 - 2',
  },
  '9-10': {
    fi: 'Luokat 3 - 4',
    en: 'Class 3 - 4',
    sv: 'Klass 3 - 4',
  },
  '11-12': {
    fi: 'Luokat 5 - 6',
    en: 'Class 5 - 6',
    sv: 'Klass 5 - 6',
  },
  '13-15': {
    fi: 'Luokat 7 - 9',
    en: 'Class 7 - 9',
    sv: 'Klass 7 - 9',
  },
};

export const chaptersTranslationMap: Record<
  ArticleChapter,
  Record<LanguageCode, string>
> = {
  start: {
    fi: 'Startti',
    en: 'Start',
    sv: 'Lär dig',
  },
  speak: {
    fi: 'Viesti',
    en: 'Speak',
    sv: 'Prata',
  },
  act: {
    fi: 'Treeni',
    en: 'Act',
    sv: 'Använd',
  },
  assess: {
    fi: 'Mitä opit?',
    en: 'Assess',
    sv: 'Reflektera',
  },
};
