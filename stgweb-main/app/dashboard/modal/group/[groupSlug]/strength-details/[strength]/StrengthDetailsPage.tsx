'use client';

import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {type StrengthSlug} from '@/lib/strength-data';
import useDashboard from '@/hooks/useExample';
import useGlobal from '@/hooks/useGlobal';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {MomentCard} from '@/components/atomic/molecules/MomentCard';
import {StrengthBadge} from '@/components/atomic/molecules/StrengthBadge';
import {sp} from '@/lib/utils';

const texts = {
  nothingHereText: {
    'en-US': 'Nothing here yet',
    'sv-SE': 'Ingenting här ännu',
    'fi-FI': 'Ei vielä mitään täällä',
  },
  goBackText: {
    'en-US': 'Go back',
    'sv-SE': 'Gå tillbaka',
    'fi-FI': 'Mene takaisin',
  },
  moreToNextLevelText: {
    'en-US': 'more to next level',
    'sv-SE': 'mer till nästa nivå',
    'fi-FI': 'lisää seuraavalle tasolle',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly strength: StrengthSlug;
  readonly groupSlug: string;
  readonly moments?: any[];
};

export const StrengthDetailsPage = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {strength, groupSlug, moments} = props;
  const {globalState} = useGlobal();
  const {dashboardState} = useDashboard();

  if (!moments?.length) {
    return (
      <FullHeightCentered>
        <div className="flex flex-col">
          <h1>{t('nothingHereText', locale)}</h1>
          <LinkButtonWithLoader
            href={sp(PATHS.groupStrengths, {groupSlug})}
            className="mt-8 bg-primary p-2 text-xs text-white"
          >
            {t('goBackText', locale)}
          </LinkButtonWithLoader>
        </div>
      </FullHeightCentered>
    );
  }

  const count = moments.length;
  const countToNextLevel = 10 - moments.length;

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto mt-4 flex w-full max-w-7xl flex-col sm:flex-row">
        <div className="list hidden lg:block lg:w-1/3" />
        <div className="list mb-4 w-full space-y-4 sm:w-2/3">
          {moments.map((moment) => (
            <MomentCard
              key={`moment-${moment.id}`}
              loggedInUserId={dashboardState.userId}
              authToken={globalState.userAuthToken}
              moment={moment}
              locale={locale}
              target="group"
            />
          ))}
        </div>
        <div className="list order-first w-full sm:order-none sm:h-auto sm:w-1/3">
          <div className="w-full pb-8 sm:pb-0 sm:pl-6 md:pl-8 2xl:pl-20">
            <div className="h-full w-full rounded-lg bg-[#fff3c2] py-8">
              <div className="flex h-full flex-col items-center justify-center space-y-3">
                <div className="w-28">
                  <StrengthBadge slug={strength} />
                </div>
                <div>
                  <span className="text-xl font-bold">{count}</span>
                </div>
                {countToNextLevel > 0 && (
                  <div className="px-4 text-center">
                    <span className="text-sm">
                      {countToNextLevel} {t('moreToNextLevelText', locale)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
