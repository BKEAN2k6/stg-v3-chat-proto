import {getCookies} from 'next-client-cookies/server';
import {fetchGroupMoments} from '../_utils';
import {MomentsPage} from './MomentsPage';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {getLocaleCode} from '@/lib/locale';
import {PATHS} from '@/constants.mjs';

const PATH = PATHS.homeMoments;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => fetchGroupMoments(directus));

export default async function DashboardGroupGroupSlugMomentsPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const moments = await getData();
  return (
    <>
      <MomentsPage locale={locale} moments={moments} />
      <AnalyticsEventRecorder event="router:group_moments_page_loaded" />
    </>
  );
}
