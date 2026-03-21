import {StrengthDetailsPage} from './StrengthDetailsPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {dbMomentToMomentCardData} from '@/lib/data-transformation';

type Props = {
  params: {
    strength: StrengthSlug;
  };
};

const PATH = PATHS.profile;

const getData = async (strength: StrengthSlug) =>
  serverDataQueryWrapper(PATH, async (directus) => {
    const me = await directus.users.me.read();
    const momentsQuery = await directus.items('swl_moment').readByQuery({
      fields: ['*', 'files.directus_files.*', 'strengths.*', 'created_by.*'],
      filter: {
        _and: [
          {
            swl_item: {
              swl_wall_links: {
                swl_wall: {
                  id: {
                    _eq: me.swl_wall,
                  },
                },
              },
            },
          },
          {
            status: {
              _eq: 'published',
            },
          },
          {
            strengths: {
              strength: {
                id: {
                  _eq: StrengthIDMap[strength],
                },
              },
            },
          },
        ],
      },
      limit: -1,
      sort: ['-date_created'] as never,
    });

    const moments = momentsQuery.data;

    return moments?.map((dbMoment: any) => dbMomentToMomentCardData(dbMoment));
  });

export default async function DashboardModalProfileStrengthDetailsStrengthPage(
  props: Props,
) {
  const {strength} = props.params;
  const moments = await getData(strength);

  return (
    <>
      <StrengthDetailsPage strength={strength} moments={moments} />
      <AnalyticsEventRecorder event="router:profile_strength_details_page_loaded" />
    </>
  );
}
