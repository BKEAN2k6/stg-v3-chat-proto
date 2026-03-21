import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {SaveSignatureStrengths} from './SaveSignatureStrengths';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {type StrengthSlug, StrengthSlugs} from '@/lib/strength-data';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {StrengthIconAndName} from '@/components/atomic/molecules/StrengthIconAndName';
import Confetti2 from '@/components/draft/confetti-2';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  invalidStrengths: {
    'en-US': 'Error saving strengths.',
    'fi-FI': 'Virhe vahvuuksien tallentumisessa.',
    'sv-SE': 'Det gick inte att spara styrkor.',
  },
  tryAgainLink: {
    'en-US': 'Try again.',
    'fi-FI': 'Yritä uudelleen.',
    'sv-SE': 'Försök igen.',
  },
  congratulationsTitle: {
    'en-US': 'Congratulations! Here are your signature strengths!',
    'fi-FI': 'Onneksi olkoon! Tunnistit nämä vahvuudet itsessäsi!',
    'sv-SE': 'Grattis! Här är dina kärnstyrkor!',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function StrengthsOnboardingStep5Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const strengthsProvided = String(searchParams?.strengths ?? '');
  const strengthsArray = strengthsProvided.split(',') as StrengthSlug[];
  const validStrengths: StrengthSlug[] = strengthsArray.filter((item) =>
    StrengthSlugs.includes(item),
  );

  const hasValidStrengths = validStrengths.length === 3;

  if (!hasValidStrengths) {
    return (
      <div className="min-safe-h-screen z-10 w-screen">
        <PageTransitionWrapper>
          <FullHeightCentered>
            <div className="min-safe-h-screen flex justify-center px-4">
              <div>
                <span>{t('invalidStrengths', locale)}</span>
                <Link href={PATHS.strengthsOnboardingStart}>
                  {t('tryAgainLink', locale)}
                </Link>
              </div>
            </div>
          </FullHeightCentered>
        </PageTransitionWrapper>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-primary-lighter-3">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={600}>
          <div className="z-10 px-4 text-center">
            <h1 className="mb-10 mt-4 w-full max-w-2xl text-xl font-bold text-black sm:mb-20 sm:text-2xl md:text-3xl">
              {t('congratulationsTitle', locale)}
            </h1>
            <div className="mb-2 flex flex-wrap justify-center px-8 sm:mb-8 md:mb-16">
              {validStrengths.map((slug) => (
                <div key={slug} className="mb-4 px-4 sm:px-8">
                  <StrengthIconAndName
                    slug={slug}
                    size="lg"
                    imageWrapperClassName="sm:mb-8"
                    textWrapperClassName="font-bold"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center pb-4">
              <SaveSignatureStrengths signatureStrengths={validStrengths} />
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
      <Confetti2 />
    </div>
  );
}
