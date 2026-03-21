import {dbMomentToMomentCardData} from '@/lib/data-transformation';
import {calculateProfileData} from '@/lib/strength-helpers';

export const fetchProfileData = async (directus: any) => {
  const me = await directus.users.me.read();
  const {strengths, topStrengths} = await calculateProfileData(
    me.swl_wall,
    directus,
  );

  const creditCount = me?.credit_count
    ? Number.parseFloat(me?.credit_count)
    : 0;

  // NOTE: this should not be here, since we get a write with every request!  To
  // optimize things, we'd likely want some sort of a background job to update
  // these periodically... (or immediately in cases where they are expected to
  // get updated)
  await directus.users.me.update({
    top_strengths: topStrengths,
  });

  return {strengths, topStrengths, creditCount};
};

export async function fetchOwnMoments(directus: any) {
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
          from_strengths_onboarding: {
            _null: true,
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
