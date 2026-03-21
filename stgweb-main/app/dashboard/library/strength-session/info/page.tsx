import {getCookies} from 'next-client-cookies/server';
import {getLocaleCode} from '@/lib/locale';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  hello: {
    'en-US': 'Hello',
    'fi-FI': 'Hei',
    'sv-SE': 'Hej',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function LibraryStrengthSessionInfoPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <div>{t('hello', locale)}</div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
