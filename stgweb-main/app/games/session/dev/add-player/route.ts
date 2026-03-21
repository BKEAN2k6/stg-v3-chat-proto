import crypto from 'node:crypto';
import {type NextRequest} from 'next/server';
import {faker} from '@faker-js/faker';
import {
  IS_DEVELOPMENT_OR_STAGING,
  USER_ROLE_ID,
  USER_SWL_MEDIA_PARENT_FOLDER_ID,
} from '@/constants.mjs';
import {getRandomSlugColorPair} from '@/lib/avatar-helpers';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

// This will add a new user to a session similarly as how it would be done in a
// real case. This just makes testing and development a whole lot easier. Works
// only on the development environment.

// Takes in the session ID, returns the added users first name.

export async function POST(request: NextRequest) {
  if (!IS_DEVELOPMENT_OR_STAGING) {
    return respond(401, 'unauthorized');
  }

  const body = await request.json();

  const adminDirectus = await createServerSideAdminDirectusClient();

  // create a new user
  const newUserId = crypto.randomUUID();
  const firstName = faker.person.firstName();
  const randomEmailString = crypto.randomBytes(8).toString('hex');
  const email = `${randomEmailString}+${Date.now()}@positive.fi`;
  const randomPasswordString = crypto.randomBytes(16).toString('hex');
  const password = `${randomPasswordString}${Date.now()}`;
  const newAvatarSlugAndColorPair = getRandomSlugColorPair([]);
  try {
    // get session
    const strengthSessionQuery: any = await adminDirectus
      .items('strength_session')
      .readOne(body.sessionId);
    // create user to group + session
    await adminDirectus.items('user_to_group').createOne({
      group: strengthSessionQuery?.group,
      user: {
        id: newUserId,
        email,
        password,
        role: USER_ROLE_ID,
        first_name: firstName,
        avatar_slug: newAvatarSlugAndColorPair.slug,
        color: newAvatarSlugAndColorPair.color,
        active_group: strengthSessionQuery?.group,
        active_strength_session: body.sessionId,
        is_strength_session_user: true,
        swl_wall: {
          media_folder: {
            name: `user_${newUserId.slice(0, 8)}_swl_media`,
            parent: USER_SWL_MEDIA_PARENT_FOLDER_ID,
          },
        },
      },
    });
    // create new websocket event
    await adminDirectus.items('strength_session_new_player').createOne({
      strength_session: body.sessionId,
      user: newUserId,
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed');
  }

  return respond(200, 'ok', {
    firstName,
  });
}
