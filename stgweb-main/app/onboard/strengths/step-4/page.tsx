import {getCookies} from 'next-client-cookies/server';
import {OnboardingContinueButton} from '../../OnboardingContinueButton';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  seeWhatYouAreMadeOfTitle: {
    'en-US': 'Let’s see what you are made of...',
    'fi-FI': 'Kiitos! Siirrytään eteenpäin...',
    'sv-SE': 'Låt oss se vad du är gjord av...',
  },
  continueButton: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StrengthsOnboardingStep4Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="min-safe-h-screen w-screen bg-primary">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={320}>
          <div className="px-4 text-center">
            <h1 className="mb-20 mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-xl">
              {t('seeWhatYouAreMadeOfTitle', locale)}
            </h1>
            <div className="flex justify-center">
              <OnboardingContinueButton
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                target={`${PATHS.strengthsOnboardingStep5}?strengths=${searchParams?.strengths}`}
              >
                {t('continueButton', locale)}
              </OnboardingContinueButton>
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
