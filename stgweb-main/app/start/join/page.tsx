import {getCookies} from 'next-client-cookies/server';
import {SignUpShortCodeForm} from './SignUpShortCodeForm';
import {getLocaleCode} from '@/lib/locale';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  joinSchoolTitle: {
    'en-US': 'Join your group with a short code',
    'fi-FI': 'Liity ryhmääsi lyhytkoodilla',
    'sv-SE': 'Anslut till din grupp med en kortkod',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StartJoinPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-5 mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-xl">
              {t('joinSchoolTitle', locale)}
            </h1>
            <SignUpShortCodeForm />
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
