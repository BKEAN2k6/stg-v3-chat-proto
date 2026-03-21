import {getCookies} from 'next-client-cookies/server';
import PrimaryButton from './PrimaryButton';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  pageTitle: {
    'en-US': 'Uh oh, something wrong...',
    'sv-SE': 'Oj då, något gick fel...',
    'fi-FI': 'Voi ei, jotain meni pieleen...',
  },
  // Add more translations as needed
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function ErrorsInvalidSessionPage() {
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
            <PrimaryButton />
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
