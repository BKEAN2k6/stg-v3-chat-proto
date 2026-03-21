import {type NextRequest} from 'next/server';
import {
  createServerSideAdminDirectusClient,
  getAvailableJoinShortCode,
} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';

// this will create both the group and a new session

// NOTE: don't allow creating session if there's already one started (started or active)
// set a join_short_code to the group (groups should basically be the user containers)

export async function POST(request: NextRequest) {
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  const body = await request.json();

  const adminDirectus = await createServerSideAdminDirectusClient();

  if (!body.name || body.name.trim === '' || body.name.length > 50) {
    return respond(400, 'invalid-name');
  }

  const availableJoinShortCode = await getAvailableJoinShortCode(adminDirectus);

  const timeIn99Years = new Date();
  timeIn99Years.setFullYear(timeIn99Years.getFullYear() + 99);

  // create group and add user and session to it
  const createResponse: any = await adminDirectus.items('group').createOne({
    status: 'published',
    name: body.name,
    join_short_code: availableJoinShortCode,
    join_short_code_expires_at: timeIn99Years.toISOString(),
    strength_sessions: {
      create: [
        {
          mode: 'own_and_peer_strengths_with_bonus',
          user_created: loggedInUser.id,
        },
      ],
    },
    user_links: {
      create: [
        {
          user: loggedInUser.id,
        },
      ],
    },
  });

  const createdGroupId = createResponse?.id;
  const strengthSessionId = createResponse?.strength_sessions?.[0];

  // update logged in users information
  await adminDirectus.items('directus_users').updateOne(loggedInUser.id, {
    active_group: createdGroupId,
    active_strength_session: strengthSessionId,
  });

  return respond(200, 'ok', {
    strengthSessionId,
    joinShortCode: createResponse?.join_short_code,
  });
}
