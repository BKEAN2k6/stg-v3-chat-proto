import {type NextRequest} from 'next/server';
import {cancelActiveSessions} from '../_utils';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  const body = await request.json();

  const adminDirectus = await createServerSideAdminDirectusClient();

  if (!body.groupSlug || body.groupSlug.trim === '') {
    return respond(400, 'invalid-group-slug');
  }

  const timeInOneHour = new Date();
  timeInOneHour.setHours(timeInOneHour.getHours() + 1);

  const groupQuery: any = await adminDirectus.items('group').readByQuery({
    filter: {
      slug: {
        _eq: body.groupSlug,
      },
    },
  });

  const group = groupQuery?.data?.[0];

  if (!group) {
    return respond(404, 'group-not-found');
  }

  // all active or started sessions need to be canceled before starting a new one...
  await cancelActiveSessions(adminDirectus, group.id);

  try {
    const createResponse: any = await adminDirectus
      .items('strength_session')
      .createOne({
        mode: 'own_and_peer_strengths_with_bonus',
        group: group.id,
        user_created: loggedInUser.id,
      });

    if (!createResponse.id) {
      throw new Error('session-id-not-available');
    }

    // update logged in users information
    await adminDirectus.items('directus_users').updateOne(loggedInUser.id, {
      active_strength_session: createResponse.id,
    });

    return respond(200, 'ok', {
      strengthSessionId: createResponse.id,
      joinShortCode: group.join_short_code,
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-create-session');
  }
}
