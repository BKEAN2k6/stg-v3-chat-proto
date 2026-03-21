import {type NextRequest} from 'next/server';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  const adminDirectus = await createServerSideAdminDirectusClient();

  const userToGroupLinkQuery = await adminDirectus
    .items('user_to_group')
    .readByQuery({
      fields: ['group.id', 'group.swl_wall'],
      filter: {
        _and: [
          {
            user: {
              id: {
                _eq: loggedInUser.id,
              },
            },
          },
          {
            group: {
              id: {
                _eq: body.groupId,
              },
            },
          },
        ],
      },
    });

  const userToGroupLink = userToGroupLinkQuery.data?.[0];

  if (!userToGroupLink) {
    return respond(401, 'permission-denied', {
      reason: 'not-linked-to-group',
    });
  }

  await adminDirectus.items('directus_users').updateOne(loggedInUser.id, {
    active_group: userToGroupLink.group.id,
  });

  return respond(200, 'ok');
}
