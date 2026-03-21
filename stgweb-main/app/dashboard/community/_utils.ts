import {dbMomentToMomentCardData} from '@/lib/data-transformation';

export async function fetchCommunityMoments(directus: any) {
  const me = await directus.users.me.read({
    fields: ['active_organization.swl_wall'],
  });
  const activeOrganizationStrengthWallId = me.active_organization.swl_wall;
  const momentsQuery = await directus.items('swl_moment').readByQuery({
    fields: ['*', 'files.directus_files.*', 'strengths.*', 'created_by.*'],
    filter: {
      _and: [
        {
          swl_item: {
            swl_wall_links: {
              swl_wall: {
                id: {
                  _eq: activeOrganizationStrengthWallId,
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
