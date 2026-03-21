import {getCookies} from 'next-client-cookies/server';
import {NameForm} from './NameForm';
import {getLocaleCode} from '@/lib/locale';
import {LoginWrapper} from '@/components/LoginWrapper';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  whatIsYourNameTitle: {
    'en-US': 'What is your name?',
    'fi-FI': 'Mikä on nimesi?',
    'sv-SE': 'Vad heter du?',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StartHelloPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen w-screen bg-primary">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          {/* this client component handles the logic for logging in
          automatically based on the data we received from during the join
          process */}
          <div>
            <LoginWrapper userType="dashboard-user">
              <div className="text-center">
                <h1 className="mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-xl">
                  {t('whatIsYourNameTitle', locale)}
                </h1>
                <NameForm />
              </div>
            </LoginWrapper>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
