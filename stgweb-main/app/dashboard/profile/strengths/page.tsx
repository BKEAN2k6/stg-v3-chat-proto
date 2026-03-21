import {getCookies} from 'next-client-cookies/server';
// import {IntroTour} from '../IntroTour';
import {fetchProfileData} from '../_utils';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {StrengthProfile} from '@/components/StrengthProfile/StrengthProfile';
import {getLocaleCode} from '@/lib/locale';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';

const texts = {
  goToOnboardingText: {
    'en-US': 'Go through the strength onboarding to complete your profile',
    'sv-SE': 'Gå igenom styrke-introduktionen för att slutföra din profil',
    'fi-FI': 'Käy läpi perehdytys täydentääksesi profiiliasi',
  },
  goToOnboardingLink: {
    'en-US': 'Go to onboarding',
    'sv-SE': 'Gå till omboarding',
    'fi-FI': 'Siirry perehdytykseen',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const PATH = PATHS.profileStrengths;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => fetchProfileData(directus));

export default async function DashboardProfilePage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {strengths, topStrengths} = (await getData()) ?? {};

  if (!strengths?.length) {
    return (
      <div className="mx-auto w-full max-w-md text-center">
        {t('goToOnboardingText', locale)}
        <LinkButtonWithLoader
          href={PATHS.strengthsOnboardingStart}
          className="mt-4"
        >
          {t('goToOnboardingLink', locale)}
        </LinkButtonWithLoader>
      </div>
    );
  }

  return (
    <>
      <div id="intro-tour-step-4">
        <StrengthProfile
          strengths={strengths}
          topStrengths={topStrengths}
          target="self"
        />
      </div>
      {/* <IntroTour /> */}
      <AnalyticsEventRecorder event="router:profile_strengths_page_loaded" />
    </>
  );
}
