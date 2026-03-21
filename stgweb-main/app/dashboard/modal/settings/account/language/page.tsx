import {getCookies} from 'next-client-cookies/server';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  setLanguage: {
    'en-US': 'Set language',
    'fi-FI': 'Aseta kieli',
    'sv-SE': 'Välj språk',
  },
  finnish: {
    'en-US': 'Finnish',
    'fi-FI': 'Suomi',
    'sv-SE': 'Finska',
  },
  english: {
    'en-US': 'English',
    'fi-FI': 'Englanti',
    'sv-SE': 'Engelska',
  },
  swedish: {
    'en-US': 'Swedish',
    'fi-FI': 'Ruotsi',
    'sv-SE': 'Svenska',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const DashboardSettingsAccountLanguagePage = () => {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="px-8 pt-4 md:px-16">
      <h1 className="mb-4 text-lg font-bold">{t('setLanguage', locale)}</h1>
      <div className="flex flex-col space-y-4">
        <a
          href={`${PATHS.setLocale.replace('[locale]', 'fi-FI')}?target=${
            PATHS.accountSettingsLanguage
          }`}
          className="text-primary underline"
        >
          {t('finnish', locale)}
        </a>
        <a
          href={`${PATHS.setLocale.replace('[locale]', 'en-US')}?target=${
            PATHS.accountSettingsLanguage
          }`}
          className="text-primary underline"
        >
          {t('english', locale)}
        </a>
        <a
          href={`${PATHS.setLocale.replace('[locale]', 'sv-SE')}?target=${
            PATHS.accountSettingsLanguage
          }`}
          className="text-primary underline"
        >
          {t('swedish', locale)}
        </a>
      </div>
    </div>
  );
};

export default DashboardSettingsAccountLanguagePage;
