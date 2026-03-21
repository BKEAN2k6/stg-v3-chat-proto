import {MomentDetailsModal} from './MomentDetailsModal';
import {PATHS} from '@/constants.mjs';
import {dbMomentToMomentCardData} from '@/lib/data-transformation';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {type StrengthSlug} from '@/lib/strength-data';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

type Props = {
  params: {
    momentId: StrengthSlug;
  };
};

const PATH = PATHS.profile;

const getData = async (momentId: string) =>
  serverDataQueryWrapper(PATH, async (directus) => {
    const dbMoment = await directus.items('swl_moment').readOne(momentId, {
      fields: ['*', 'files.directus_files.*', 'strengths.*', 'created_by.*'],
    });
    return dbMomentToMomentCardData(dbMoment);
  });

export default async function DashboardInboxMomentDetailsMomentPage(
  props: Props,
) {
  const {momentId} = props.params;
  const moment = await getData(momentId);
  // console.log(moments)

  return (
    <>
      <MomentDetailsModal moment={moment} />
      <AnalyticsEventRecorder event="router:inbox_moment_details_page_loaded" />
    </>
  );
}
