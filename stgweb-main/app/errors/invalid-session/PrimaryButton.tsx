'use client';

import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  tryLogInAgain: {
    'en-US': 'Try to log in again',
    'sv-SE': 'Försök logga in igen',
    'fi-FI': 'Yritä kirjautua uudelleen',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const PrimaryButton = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const router = useRouter();

  const doCleanUpAuth = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires');
    localStorage.removeItem('auth_expires_at');
    await fetch('/auth/server-logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    router.push('/');
  };

  return (
    <a href="#" onClick={doCleanUpAuth}>
      {t('tryLogInAgain', locale)}
    </a>
  );
};

export default PrimaryButton;
