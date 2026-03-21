import {type NextRequest} from 'next/server';
import {
  createServerSideAdminDirectusClient,
  getAvailableJoinShortCode,
} from '@/lib/directus';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';
import slugify from '@/lib/slugify';
import {getRandomSlugColorPair} from '@/lib/avatar-helpers';
import {generateSafeRandomString} from '@/lib/utils';
import {ORG_SWL_MEDIA_PARENT_FOLDER_ID} from '@/constants.mjs';

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
  const newAvatarSlugAndColorPair = getRandomSlugColorPair([]);
  const newGroupId = crypto.randomUUID();

  const timeIn99Years = new Date();
  timeIn99Years.setFullYear(timeIn99Years.getFullYear() + 99);

  // create a group and add user to it
  await adminDirectus.items('group').createOne({
    status: 'published',
    name: body.name,
    slug: `${slugify(body.name)}-${generateSafeRandomString()}`,
    color: newAvatarSlugAndColorPair.color,
    join_short_code: availableJoinShortCode,
    join_short_code_expires_at: timeIn99Years.toISOString(),
    user_links: {
      create: [
        {
          user: loggedInUser.id,
        },
      ],
    },
    organization: loggedInUser.active_organization,
    swl_wall: {
      media_folder: {
        name: `group_${newGroupId.slice(0, 8)}_swl_media`,
        parent: ORG_SWL_MEDIA_PARENT_FOLDER_ID,
      },
    },
  });

  return respond(200, 'ok');
}
