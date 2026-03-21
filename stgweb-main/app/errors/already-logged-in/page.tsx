import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  pageTitle: {
    'en-US': 'You are already logged in 🎉',
    'sv-SE': 'Du är redan inloggad 🎉',
    'fi-FI': 'Olet jo kirjautunut sisään 🎉',
  },
  goToProfile: {
    'en-US': 'Go to your profile',
    'sv-SE': 'Gå till din profil',
    'fi-FI': 'Siirry profiiliisi',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function ErrorsAlreadyLoggedInPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <FullHeightCentered>
          <div className="flex flex-col justify-center px-4 text-center text-white">
            <h1 className="mb-8 text-xl font-semibold">
              {t('pageTitle', locale)}
            </h1>
            <Link href={PATHS.profile}>{t('goToProfile', locale)}</Link>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
