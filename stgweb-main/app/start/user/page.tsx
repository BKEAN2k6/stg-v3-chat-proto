import {getCookies} from 'next-client-cookies/server';
import {PasswordForm} from './PasswordForm';
import {getLocaleCode} from '@/lib/locale';
import {LoginWrapper} from '@/components/LoginWrapper';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  addPasswordTitle: {
    'en-US': 'Add a password to your account',
    'fi-FI': 'Lisää salasana tilillesi',
    'sv-SE': 'Lägg till ett lösenord till ditt konto',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StartAdminPage() {
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
                  {t('addPasswordTitle', locale)}
                </h1>
                <PasswordForm />
              </div>
            </LoginWrapper>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
