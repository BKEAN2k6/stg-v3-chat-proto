import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  pageTitle: {
    'en-US': 'Uh oh, something wrong...',
    'sv-SE': 'Oj då, något gick fel...',
    'fi-FI': 'Voi ei, jotain meni pieleen...',
  },
  loginRequired: {
    'en-US': 'You need to be logged in to view this page.',
    'sv-SE': 'Du måste logga in för att se den här sidan.',
    'fi-FI': 'Sinun on oltava kirjautuneena nähdäksesi tämän sivun.',
  },
  goToStart: {
    'en-US': 'Go to start',
    'sv-SE': 'Gå till start',
    'fi-FI': 'Siirry aloitussivulle',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function ErrorsLoginNeededPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <FullHeightCentered>
          <div className="flex flex-col justify-center px-4 text-center text-white">
            <h1 className="text-xl font-semibold">{t('pageTitle', locale)}</h1>
            <p className="mb-8">{t('loginRequired', locale)}</p>
            <Link href="/">{t('goToStart', locale)}</Link>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
