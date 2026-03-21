import {getCookies} from 'next-client-cookies/server';
import {ProfileForm} from './ProfileForm';
import {getLocaleCode} from '@/lib/locale';
import {LoginWrapper} from '@/components/LoginWrapper';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  profileFormTitle: {
    'en-US': 'Add name, color and avatar',
    'fi-FI': 'Valitse nimi, väri ja avatar',
    'sv-SE': 'Välj namn, färg och avatar',
  },
  profileFormDescription: {
    'en-US':
      'So others recognize you and see what kind of vibe you have currently.',
    'fi-FI':
      'Jotta muut tunnistavat sinut ja näkevät millaisella fiiliksellä olet liikenteessä.',
    'sv-SE':
      'Så att andra känner igen dig och ser vilken typ av vibe du har för tillfället.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdHelloPage(
  props: Props,
) {
  const {sessionId} = props.params;
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen w-screen bg-primary">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col justify-center">
            <LoginWrapper userType="strength-session-user">
              <div className="text-center">
                <h1 className="mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-2xl">
                  {t('profileFormTitle', locale)}
                </h1>
                <p className="mb-10 text-white">
                  {t('profileFormDescription', locale)}
                </p>
                <ProfileForm sessionId={sessionId} />
              </div>
            </LoginWrapper>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
