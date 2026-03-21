export async function cancelActiveSessions(directus: any, groupId: string) {
  const sessionQuery: any = await directus
    .items('strength_session')
    .readByQuery({
      filter: {
        _and: [
          {
            group: {
              _eq: groupId,
            },
          },
          {
            status: {
              _in: ['started', 'active'],
            },
          },
        ],
      },
    });

  await Promise.all(
    sessionQuery.data.map(async (session: any) => {
      return directus
        .items('strength_session')
        .updateOne(session.id, {status: 'canceled'});
    }),
  );
}
