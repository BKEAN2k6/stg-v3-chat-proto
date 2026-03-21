'use client';

import Link from 'next/link';
import {useCookies} from 'next-client-cookies';
import {ArrowLeft} from 'lucide-react';
import {TopStrengthPodiumCard} from './TopStrengthPodiumCard';
import {TopStrengthMobileCard} from './TopStrengthMobileCard';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {type StrengthSlug} from '@/lib/strength-data';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

function isISO8601(value: string) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return regex.test(value);
}

const texts = {
  error: {
    'en-US': 'Strength sprint was not valid.',
    'fi-FI': 'Vahvuustuokio oli virheellinen.',
    'sv-SE': 'Styrkesprint var inte giltigt.',
  },
  goBack: {
    'en-US': 'Go back to library',
    'fi-FI': 'Palaa kirjastoon',
    'sv-SE': 'Gå tillbaka till biblioteket',
  },
  topStrengths: {
    'en-US': 'Top strengths',
    'fi-FI': 'Yleisimmät vahvuudet',
    'sv-SE': 'Toppstyrkor',
  },
  moreStrengths: {
    'en-US': 'More strengths',
    'fi-FI': 'Lisää vahvuuksia',
    'sv-SE': 'Fler styrkor',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly groupDetails?: {
    name: string;
    participantCount: number;
    strengthCount: number;
  };
  readonly strengths?: Array<{
    slug: StrengthSlug;
    count: number;
  }>;
};

export const SessionStatsPage = (props: Props) => {
  const {groupDetails, strengths} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  if (!strengths || !groupDetails || strengths.length < 3) {
    return (
      <div className="mt-16">
        <div>{t('error', locale)}</div>
        <a
          className="mt-8 flex items-center justify-center space-x-4"
          href={PATHS.libraryRedirect}
        >
          <ArrowLeft />
          <span>{t('goBack', locale)}</span>
        </a>
      </div>
    );
  }

  const topStrengths = [strengths[0], strengths[1], strengths[2]].filter(
    Boolean,
  );
  const no1Strength = topStrengths[0] || null;
  const no2Strength = topStrengths[1] || null;
  const no3Strength = topStrengths[2] || null;

  const isGeneragedGroupName = isISO8601(groupDetails.name);

  return (
    <PageTransitionWrapper className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4">
        <div className="absolute mb-8 mt-6 flex w-full items-center justify-between">
          <div className="flex-1 text-center">
            <div className="flex flex-col">
              <div className="font-bold">
                {t('topStrengths', locale)}
                {!isGeneragedGroupName && (
                  <>
                    <span> • </span>
                    {groupDetails.name}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex">
          <div className="min-safe-h-screen flex w-full flex-col items-center justify-center">
            <div className="flex flex-row items-end justify-center space-y-8 pt-24">
              {no2Strength && (
                <div className="w-1/3">
                  <TopStrengthPodiumCard
                    ordinal="2nd"
                    strength={no2Strength}
                    locale={locale}
                  />
                </div>
              )}
              {no1Strength && (
                <div className="w-1/3">
                  <TopStrengthPodiumCard
                    ordinal="1st"
                    strength={no1Strength}
                    locale={locale}
                  />
                </div>
              )}
              {no3Strength && (
                <div className="w-1/3">
                  <TopStrengthPodiumCard
                    ordinal="3rd"
                    strength={no3Strength}
                    locale={locale}
                  />
                </div>
              )}
            </div>

            <div className="mt-24 pb-12">
              <Link
                href={PATHS.libraryRedirect}
                className="mt-2 text-xs underline"
              >
                {t('goBack', locale)}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:hidden">
          <div className="mt-24 flex flex-col items-center space-y-4">
            <TopStrengthMobileCard strength={no1Strength} locale={locale} />
            <TopStrengthMobileCard strength={no2Strength} locale={locale} />
            <TopStrengthMobileCard strength={no3Strength} locale={locale} />
          </div>
          <div className="mt-12 pb-12">
            <Link
              href={PATHS.libraryRedirect}
              className="mt-2 text-xs underline"
            >
              {t('goBack', locale)}
            </Link>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};
