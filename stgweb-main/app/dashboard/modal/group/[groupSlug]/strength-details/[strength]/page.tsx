import {StrengthDetailsPage} from './StrengthDetailsPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {dbMomentToMomentCardData} from '@/lib/data-transformation';

type Props = {
  params: {
    groupSlug: string;
    strength: StrengthSlug;
  };
};

const PATH = PATHS.profile;

const getData = async (groupSlug: string, strength: StrengthSlug) =>
  serverDataQueryWrapper(PATH, async (directus) => {
    const groupQuery = await directus.items('group').readByQuery({
      filter: {
        slug: groupSlug,
      },
    });
    const group = groupQuery.data?.[0] as any;
    if (!group) return;

    const momentsQuery = await directus.items('swl_moment').readByQuery({
      fields: ['*', 'files.directus_files.*', 'strengths.*', 'created_by.*'],
      filter: {
        _and: [
          {
            swl_item: {
              swl_wall_links: {
                swl_wall: {
                  id: {
                    _eq: group.swl_wall,
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
  const {groupSlug, strength} = props.params;
  const moments = await getData(groupSlug, strength);

  return (
    <>
      <StrengthDetailsPage
        strength={strength}
        moments={moments}
        groupSlug={groupSlug}
      />
      <AnalyticsEventRecorder event="router:profile_strength_details_page_loaded" />
    </>
  );
}
