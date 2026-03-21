import {getCookies} from 'next-client-cookies/server';
import {EmailAndPasswordForm} from './EmailAndPasswordForm';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  finalizeAccountTitle: {
    'en-US': 'Finalize your account',
    'fi-FI': 'Viimeistele käyttäjätilisi',
    'sv-SE': 'Slutför ditt konto',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StartProfile2Page() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={420}>
          <div className="px-4 text-center">
            <h1 className="mb-4 mt-10 w-full max-w-2xl text-lg font-semibold sm:text-xl">
              {t('finalizeAccountTitle', locale)}
            </h1>
            <EmailAndPasswordForm />
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
