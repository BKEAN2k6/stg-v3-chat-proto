import {type NextRequest} from 'next/server';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';
import {type UserToOrganization} from '@/types/userToOrganization';

export async function GET(request: NextRequest) {
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  const adminDirectus = await createServerSideAdminDirectusClient();

  const userToOrgLinkQuery = await adminDirectus
    .items('user_to_organization')
    .readByQuery({
      fields: [
        'role',
        'organization.id',
        'organization.slug',
        'organization.color',
        'organization.avatar',
        'organization.translation.name',
        'organization.translation.language_code',
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
        ],
      },
    });

  const userToOrgLinks = userToOrgLinkQuery.data as
    | UserToOrganization[]
    | undefined;

  return respond(200, 'ok', {data: userToOrgLinks});
}
