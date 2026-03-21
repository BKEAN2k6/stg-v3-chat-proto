import {getCookies} from 'next-client-cookies/server';
import {OnboardingContinueButton} from '../../OnboardingContinueButton';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  identifyAndNameStrengths: {
    'en-US':
      'Now it’s time to identify and name the strengths you used in that situation!',
    'sv-SE':
      'Nu är det dags att identifiera och namnge de styrkor du använde i den situationen!',
    'fi-FI':
      'Tunnista ja nimeä seuraavaksi ne vahvuudet joita käytit onnistuneessa tilanteessa!',
  },
  start: {
    'en-US': 'Start',
    'sv-SE': 'Starta',
    'fi-FI': 'Aloita',
  },
  // Add more translations as needed
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StrengthsOnboardingStep2Page() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="min-safe-h-screen w-screen bg-primary">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={320}>
          <div className="px-4 text-center">
            <h1 className="mb-20 mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-xl">
              {t('identifyAndNameStrengths', locale)}
            </h1>
            <div className="flex justify-center">
              <OnboardingContinueButton target={PATHS.strengthsOnboardingStep3}>
                {t('start', locale)}
              </OnboardingContinueButton>
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
