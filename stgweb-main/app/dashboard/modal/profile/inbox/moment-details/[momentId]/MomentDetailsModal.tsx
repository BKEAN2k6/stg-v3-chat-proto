'use client';

import Link from 'next/link';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import useDashboard from '@/hooks/useDashboard';
import useGlobal from '@/hooks/useGlobal';
import {ArrowRightIcon} from '@/components/atomic/atoms/ArrowRightIcon';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {FullScreenModal} from '@/components/atomic/molecules/FullScreenModal';
import {
  MomentCard,
  type MomentCardData,
} from '@/components/atomic/molecules/MomentCard';

const texts = {
  moment: {
    'en-US': 'Moment',
    'sv-SE': 'Sec',
    'fi-FI': 'Hetki',
  },
  momentNotFound: {
    'en-US': 'Moment not found...',
    'sv-SE': 'Sec hittades inte...',
    'fi-FI': 'Hetkeä ei löytynyt...',
  },
  goBack: {
    'en-US': 'Go back',
    'sv-SE': 'Gå tillbaka',
    'fi-FI': 'Palaa takaisin',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly moment?: MomentCardData;
};

export const MomentDetailsModal = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {globalState} = useGlobal();
  const {dashboardState} = useDashboard();
  const {moment} = props;
  const returnPath = PATHS.inbox;

  if (!moment) {
    return (
      <FullScreenModal returnPath={returnPath}>
        <FullHeightCentered>
          <div className="flex flex-col">
            <h1>{t('momentNotFound', locale)}</h1>
            <LinkButtonWithLoader
              href={returnPath}
              className="mt-8 bg-primary p-2 text-xs text-white"
            >
              {t('goBack', locale)}
            </LinkButtonWithLoader>
          </div>
        </FullHeightCentered>
      </FullScreenModal>
    );
  }

  return (
    <FullScreenModal returnPath={returnPath}>
      <>
        {/* NOTE: Don't use h-screen (or 100vh) for scroll containers, since it
        doesnt work properly on mobile devices. Check FullScreenModal as well
        (also has min-safe-h-screen) */}
        <div className="min-safe-h-screen flex flex-col">
          <div className="flex w-full px-6 pb-4 pt-6">
            <div className="flex-none">
              <Link href={returnPath}>
                <ArrowRightIcon />
              </Link>
            </div>
            <div className="flex-1">
              <h1 className="text-center text-lg font-bold">
                {t('moment', locale)}
              </h1>
            </div>
          </div>

          <div className="flex-1 justify-center overflow-auto p-6">
            <div className="mx-auto mt-4 flex w-full max-w-lg flex-col pb-8">
              <MomentCard
                key={`moment-${moment.id}`}
                showFullCardIfStrengthOnly
                loggedInUserId={dashboardState.userId}
                authToken={globalState.userAuthToken}
                moment={moment}
                locale={locale}
                target={
                  moment.creatorId === dashboardState.userId ? 'self' : 'other'
                }
              />
            </div>
          </div>
        </div>
      </>
    </FullScreenModal>
  );
};
