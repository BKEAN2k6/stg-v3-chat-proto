// import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {fetchCommunityMoments} from '../_utils';
import {DashboardLayoutFixedSidebar} from '../../DashboardLayout';
import {UsersList} from '../UsersList';
import {MomentsPage} from './MomentsPage';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';

const PATH = PATHS.homeMoments;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) =>
    fetchCommunityMoments(directus),
  );

export default async function DashboardHomeMomentsPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const moments = await getData();
  return (
    <>
      <MomentsPage moments={moments} locale={locale} />
      <DashboardLayoutFixedSidebar
        side="right"
        className="top-[54px] z-10 h-screen border-l border-[#e5e7eb]"
      >
        <div className="w-full pl-3 pt-4">
          <UsersList />
        </div>
      </DashboardLayoutFixedSidebar>
      <AnalyticsEventRecorder event="router:home_moments_page_loaded" />
    </>
  );
}
