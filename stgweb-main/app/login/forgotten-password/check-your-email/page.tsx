import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  checkYourEmail: {
    'en-US': 'A login link was sent to your email.',
    'fi-FI': 'Kirjautumislinkki lähetettiin sähköpostiisi.',
    'sv-SE': 'En inloggningslänk skickades till din e-post.',
  },
  logIn: {
    'en-US': 'Go back to the login page',
    'fi-FI': 'Palaa kirjautumissivulle',
    'sv-SE': 'Gå till inloggningssidan',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const LoginPage = () => {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen flex w-full flex-col items-center justify-center bg-white">
      <p>{t('checkYourEmail', locale)}</p>
      <Link
        href={PATHS.login}
        className="mt-8 block text-center font-bold text-primary hover:underline"
      >
        {t('logIn', locale)}
      </Link>
    </div>
  );
};

export default LoginPage;
