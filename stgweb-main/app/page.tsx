import {type ReactNode} from 'react';
import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {SplashScreen} from './SplashScreen';
import {PATHS, USER_ROLE_ID} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import ClientOnly from '@/components/ClientOnly';
import {Brand} from '@/components/atomic/atoms/Brand';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  continueOnboarding: {
    'en-US': 'Continue onboarding',
    'fi-FI': 'Jatka perehdytystä',
    'sv-SE': 'Fortsätt introduktion',
  },
  goToYourProfile: {
    'en-US': 'Go to your profile',
    'fi-FI': 'Siirry profiiliisi',
    'sv-SE': 'Gå till din profil',
  },
  logOut: {
    'en-US': 'Log out',
    'fi-FI': 'Kirjaudu ulos',
    'sv-SE': 'Logga ut',
  },
  startOver: {
    'en-US': 'Start over',
    'fi-FI': 'Aloita alusta',
    'sv-SE': 'Börja om',
  },
  joinASession: {
    'en-US': 'Join a session',
    'fi-FI': 'Liity istuntoon',
    'sv-SE': 'Gå med i en session',
  },
  logInToYourProfile: {
    'en-US': 'Log in to your profile',
    'fi-FI': 'Kirjaudu sisään profiiliisi',
    'sv-SE': 'Logga in på din profil',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => directus.users.me.read());

const PATH = '/';

type WrapperProps = {
  readonly children: ReactNode;
};

const Wrapper = (props: WrapperProps) => {
  const {children} = props;
  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <div className="flex flex-col justify-center text-center">
          <div className="max-w-screen mx-auto mt-8">
            <ClientOnly>
              <SplashScreen />
            </ClientOnly>
          </div>
          <div className="mb-8 flex justify-center">
            <Brand width={240} color="white" />
          </div>
          <div className="px-4">{children}</div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
};

export default async function IndexPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const user = await getData();

  // logged in user
  if (user) {
    const firstName = user.first_name;
    // no name, so we can assume user did not go through the first "join/hello" step
    if (!firstName) {
      return (
        <Wrapper>
          <LinkButtonWithLoader
            href={PATHS.joinOrganizationStep1}
            className="mx-auto mb-8 max-w-sm"
          >
            {t('continueOnboarding', locale)}
          </LinkButtonWithLoader>
          <Link href={PATHS.logout} className="mt-8 font-bold text-white">
            {t('startOver', locale)}
          </Link>
        </Wrapper>
      );
    }

    // regular user with no self identified signature strengths, so we can
    // assume user did not go through strengths onboarding
    const role = user.role;
    const orgRole = 'member'; // @TODO
    const selfIdentifiedSignatureStrengths =
      user.self_identified_signature_strengths;
    if (
      role === USER_ROLE_ID &&
      orgRole === 'member' &&
      !selfIdentifiedSignatureStrengths
    ) {
      return (
        <Wrapper>
          <LinkButtonWithLoader
            href={PATHS.strengthsOnboardingStart}
            className="mx-auto mb-8 max-w-sm"
          >
            {t('continueOnboarding', locale)}
          </LinkButtonWithLoader>
          <Link href={PATHS.logout} className="mt-8 font-bold text-white">
            {t('startOver', locale)}
          </Link>
        </Wrapper>
      );
    }

    // account not activated, so we can assume user did not go through the last step of onboarding
    const activeAccount = !user.expires_at;
    if (!activeAccount) {
      return (
        <Wrapper>
          <LinkButtonWithLoader
            href={PATHS.profileOnboardingStep2}
            className="mx-auto mb-8 max-w-sm"
          >
            {t('continueOnboarding', locale)}
          </LinkButtonWithLoader>
          <Link href={PATHS.logout} className="mt-8 font-bold text-white">
            {t('startOver', locale)}
          </Link>
        </Wrapper>
      );
    }

    return (
      <div>
        <Wrapper>
          <LinkButtonWithLoader
            href={PATHS.profile}
            className="mx-auto mb-8 max-w-sm"
          >
            {t('goToYourProfile', locale)}
          </LinkButtonWithLoader>
          <Link href={PATHS.logout} className="mt-8 font-bold text-white">
            {t('logOut', locale)}
          </Link>
        </Wrapper>
      </div>
    );
  }

  // not logged in user
  return (
    <Wrapper>
      <LinkButtonWithLoader
        href={PATHS.joinOrganizationStart}
        className="mx-auto mb-8 max-w-sm"
      >
        {t('joinASession', locale)}
      </LinkButtonWithLoader>
      <Link href={PATHS.login} className="mt-8 font-bold text-white">
        {t('logInToYourProfile', locale)}
      </Link>
    </Wrapper>
  );
}
