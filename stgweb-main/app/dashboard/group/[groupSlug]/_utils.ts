import {dbMomentToMomentCardData} from '@/lib/data-transformation';
import {calculateProfileData} from '@/lib/strength-helpers';

export const fetchProfileData = async (directus: any, groupSlug: string) => {
  const groupQuery = await directus.items('group').readByQuery({
    filter: {
      slug: {
        _eq: groupSlug,
      },
    },
  });
  const group = groupQuery.data?.[0];

  const {strengths, topStrengths} = await calculateProfileData(
    group.swl_wall,
    directus,
  );

  return {strengths, topStrengths};
};

export async function fetchGroupMoments(directus: any) {
  const me = await directus.users.me.read({
    fields: ['active_group.swl_wall'],
  });
  const activeGroupStrengthWallId = me.active_group.swl_wall;
  const momentsQuery = await directus.items('swl_moment').readByQuery({
    fields: ['*', 'files.directus_files.*', 'strengths.*', 'created_by.*'],
    filter: {
      _and: [
        {
          swl_item: {
            swl_wall_links: {
              swl_wall: {
                id: {
                  _eq: activeGroupStrengthWallId,
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
      ],
    },
    limit: -1,
    sort: ['-date_created'] as never,
  });

  const moments = momentsQuery.data;

  return moments?.map((dbMoment: any) => dbMomentToMomentCardData(dbMoment));
}
