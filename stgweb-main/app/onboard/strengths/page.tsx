import {getCookies} from 'next-client-cookies/server';
import {OnboardingContinueButton} from '../OnboardingContinueButton';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {Brand} from '@/components/atomic/atoms/Brand';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  startButton: {
    'en-US': 'Start',
    'fi-FI': 'Aloita',
    'sv-SE': 'Starta',
  },
  learnTitle: {
    'en-US': 'Learn how to recognize your strengths!',
    'fi-FI': 'Opi tunnistamaan vahvuutesi!',
    'sv-SE': 'Lär dig att känna igen dina styrkor!',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StrengthsOnboardingStartPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div
      className="min-safe-h-screen w-screen bg-primary bg-[length:0px_0px] bg-no-repeat sm:bg-[length:100vw_100vh]"
      style={{
        backgroundImage: 'url(/images/strengths-frame.png)',
      }}
    >
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={420}>
          <div className="px-4 text-center">
            <div className="flex justify-center">
              <Brand width={240} color="white" />
            </div>
            <h1 className="mb-20 mt-10 text-xl font-semibold text-white">
              {t('learnTitle', locale)}
            </h1>
            <div className="flex justify-center">
              <OnboardingContinueButton target={PATHS.strengthsOnboardingStep1}>
                {t('startButton', locale)}
              </OnboardingContinueButton>
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
