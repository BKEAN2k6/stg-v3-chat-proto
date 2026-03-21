'use client';

import {useState} from 'react';
import {useCookies} from 'next-client-cookies';
import {useDebounce} from 'react-use';
import {fetchCommunityMoments} from './_utils';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import useDashboard from '@/hooks/useExample';
import useGlobal from '@/hooks/useGlobal';
import {Loader} from '@/components/atomic/atoms/Loader';
import {MomentCard} from '@/components/atomic/molecules/MomentCard';

// import { EllipsisIcon } from "@/components/atomic/atoms/EllipsisIcon"
// import { ExclamationCircleIcon } from "@/components/atomic/atoms/ExclamationCircleIcon"

const texts = {
  loadNewContent: {
    'en-US': 'click to load new content',
    'sv-SE': 'klicka för att ladda nytt innehåll',
    'fi-FI': 'klikkaa ladataksesi uutta sisältöä',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly moments?: any[];
};

export const MomentList = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {globalState, cachedRender} = useGlobal();
  const {dashboardState} = useDashboard();
  const [moments, setMoments] = useState(props.moments);
  const [fetchingData, setFetchingData] = useState(cachedRender);

  useDebounce(() => {
    const run = async () => {
      if (cachedRender) {
        const directus = createClientSideDirectusClient();
        try {
          await refreshAuthIfExpired({force: true});
          const updatedInboxMoments = await fetchCommunityMoments(directus);
          setMoments(updatedInboxMoments);
        } catch {
          console.error('failed to update moments');
        }

        setFetchingData(false);
      }
    };

    run();
  });

  if (fetchingData) {
    return (
      <div className="flex w-full max-w-2xl flex-col">
        <div className="mt-8 flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto mt-4 flex w-full max-w-7xl flex-col sm:flex-row">
          <div className="list mb-4 w-full space-y-4 sm:w-full">
            {dashboardState.organizationFeedHasNewContent && (
              <a
                href="#"
                className="max-h-50 block w-full rounded-lg border border-dashed border-gray-300"
                onClick={(event) => {
                  event.preventDefault();
                  window.location.reload();
                }}
              >
                <div className="w-full animate-pulse bg-gray-50 p-2 text-center text-gray-700">
                  {t('loadNewContent', locale)}
                </div>
              </a>
            )}
            {moments?.map((moment) => (
              <MomentCard
                key={`moment-${moment.id}`}
                showFullCardIfStrengthOnly
                loggedInUserId={dashboardState.userId}
                authToken={globalState.userAuthToken}
                moment={moment}
                locale={locale}
                target="org"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
