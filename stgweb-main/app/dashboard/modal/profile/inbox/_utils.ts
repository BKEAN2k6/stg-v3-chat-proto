export async function fetchInboxMoments(directus: any) {
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
          created_by: {
            _neq: me.id,
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

  return moments?.map((dbMoment: any) => ({
    id: dbMoment.id,
    createdAt: dbMoment.date_created,
    // NOTE: only using the first strength... Usually just fine.
    strength: dbMoment.strengths?.[0].strength,
  }));
}
