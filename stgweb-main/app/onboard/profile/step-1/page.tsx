import {getCookies} from 'next-client-cookies/server';
import {ImageUpload} from './ImageUpload';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  title: {
    'en-US': 'Add your profile picture',
    'fi-FI': 'Lisää profiilikuvasi',
    'sv-SE': 'Lägg till din profilbild',
  },
  description: {
    'en-US': 'Add a picture that represents you',
    'fi-FI': 'Lisää kuva, joka edustaa sinua',
    'sv-SE': 'Lägg till en bild som representerar dig',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StartProfile1Page() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={420}>
          <div className="px-4 text-center">
            <h1 className="mb-4 mt-10 w-full max-w-2xl text-lg font-semibold sm:text-xl">
              {t('title', locale)}
            </h1>
            <p className="mb-6">{t('description', locale)}</p>
            <ImageUpload />
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
