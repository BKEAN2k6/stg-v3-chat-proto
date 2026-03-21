import {type NextRequest} from 'next/server';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';

type UserToOrganization = {
  id: string;
  user: string;
  organization: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  const adminDirectus = await createServerSideAdminDirectusClient();

  const userToOrgLinkQuery = await adminDirectus
    .items('user_to_organization')
    .readByQuery({
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
            organization: {
              id: {
                _eq: body.organizationId,
              },
            },
          },
        ],
      },
    });

  const userToOrgLink = userToOrgLinkQuery.data?.[0] as
    | UserToOrganization
    | undefined;

  if (!userToOrgLink) {
    return respond(401, 'permission-denied', {
      reason: 'not-linked-to-organization',
    });
  }

  await adminDirectus.items('directus_users').updateOne(loggedInUser.id, {
    active_organization: userToOrgLink.organization,
  });

  return respond(200, 'ok');
}
