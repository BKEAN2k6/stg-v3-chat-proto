import {getCookies} from 'next-client-cookies/server';
import {fetchOwnMoments} from '../_utils';
import {MomentsPage} from './MomentsPage';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PATHS} from '@/constants.mjs';

const PATH = PATHS.profileMoments;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => fetchOwnMoments(directus));

export default async function DashboardCommunityPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const moments = await getData();
  return (
    <>
      <MomentsPage moments={moments} locale={locale} />
      <AnalyticsEventRecorder event="router:profile_moments_page_loaded" />
    </>
  );
}
