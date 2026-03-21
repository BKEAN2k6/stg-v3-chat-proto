'use client';

import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';
import useDashboard from '@/hooks/useDashboard';

const texts = {
  profile: {
    'en-US': 'Profile',
    'fi-FI': 'Profiili',
    'sv-SE': 'Profil',
  },
  firstName: {
    'en-US': 'First Name',
    'fi-FI': 'Etunimi',
    'sv-SE': 'Förnamn',
  },
  lastName: {
    'en-US': 'Last Name',
    'fi-FI': 'Sukunimi',
    'sv-SE': 'Efternamn',
  },
  contactUs: {
    'en-US': 'Please contact us at',
    'fi-FI': 'Ole yhteyttä meihin osoitteeseen',
    'sv-SE': 'Kontakta oss på',
  },
  changeInfo: {
    'en-US': 'to change your profile information.',
    'fi-FI': 'muuttaaksesi profiilitietojasi.',
    'sv-SE': 'för att ändra din profilinformation.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const UserSettings = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {dashboardState} = useDashboard();

  return (
    <>
      <h1 className="mb-4 text-lg font-bold">{t('profile', locale)}</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">
            {t('firstName', locale)}
          </label>
          <input
            disabled
            type="text"
            className="form-input mt-1 w-full rounded-md p-3"
            value={dashboardState.userFirstName}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('lastName', locale)}</label>
          <input
            disabled
            type="text"
            className="form-input mt-1 w-full rounded-md p-3"
            value={dashboardState.userLastName}
          />
        </div>
        <div className="mt-8 max-w-sm">
          <p>
            {t('contactUs', locale)}{' '}
            <a
              href="mailto:support@seethegood.app"
              className="text-primary underline"
            >
              support@seethegood.app
            </a>{' '}
            {t('changeInfo', locale)}
          </p>
        </div>
      </form>
    </>
  );
};
