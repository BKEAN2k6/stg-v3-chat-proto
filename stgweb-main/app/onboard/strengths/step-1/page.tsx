import {getCookies} from 'next-client-cookies/server';
import {OnboardingContinueButton} from '../../OnboardingContinueButton';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  reflectTitle: {
    'en-US':
      'Reflect on a moment that you succeeded in. Where you felt energized, effortless and engaged.',
    'fi-FI':
      'Pohdi tilannetta, jossa viimeksi onnistuit työssäsi. Hetkeä, jossa tunsit olevasi täynnä energiaa ja asiat sujuivat vaivattomasti.',
    'sv-SE':
      'Reflektera över en stund när du lyckades. Där du kände dig energisk, lättsam och engagerad.',
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

export default async function StrengthsOnboardingStep1Page() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="min-safe-h-screen w-screen bg-primary">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={320}>
          <div className="px-4 text-center">
            <h1 className="mb-20 mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-xl">
              {t('reflectTitle', locale)}
            </h1>
            <div className="flex justify-center">
              <OnboardingContinueButton target={PATHS.strengthsOnboardingStep2}>
                {t('continueButton', locale)}
              </OnboardingContinueButton>
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
