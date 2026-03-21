import {type NextRequest} from 'next/server';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';
import {type UserToGroup} from '@/types/userToGroup';

export async function GET(request: NextRequest) {
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  const adminDirectus = await createServerSideAdminDirectusClient();

  const userToGroupLinkQuery = await adminDirectus
    .items('user_to_group')
    .readByQuery({
      fields: [
        'group.id',
        'group.slug',
        'group.color',
        'group.avatar',
        'group.name',
        'group.swl_wall',
      ],
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
              organization: {
                id: {
                  _eq: loggedInUser.active_organization,
                },
              },
            },
          },
        ],
      },
    });

  const userToGroupLinks = userToGroupLinkQuery.data as
    | UserToGroup[]
    | undefined;

  return respond(200, 'ok', {data: userToGroupLinks});
}
