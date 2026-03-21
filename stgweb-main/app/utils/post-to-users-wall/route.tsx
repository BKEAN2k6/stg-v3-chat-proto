import {type NextRequest} from 'next/server';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {logToSentry} from '@/lib/log';
import {getLoggedInUser, respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const loggedInUser = await getLoggedInUser(request);

  if (!loggedInUser?.id) {
    return respond(401, 'permission-denied');
  }

  // @TODO make sure sending and recipient are in the same organization

  const body = await request.json();
  const peekAccessToken = body.peekAccessToken;

  const targetSwlWallId = body.targetSwlWallId;
  const content = body.content;
  const strengths = body.strengths;

  try {
    const directus = await createServerSideAdminDirectusClient();
    const createMomentCall: any = await directus.items('swl_moment').createOne({
      status: 'published',
      created_by: loggedInUser.id,
      peek_access_token: peekAccessToken,
      swl_item: {
        type: 'moment',
        swl_wall_links: [{swl_wall: targetSwlWallId}],
      },
      strengths,
      ...(content && {markdown_content: content}),
    });
    // this is done so that user can update an image and it can be directly put
    // in to the correct folder.
    const targetSwlWall: any = await directus
      .items('swl_wall')
      .readOne(targetSwlWallId);
    const targetMediaFolder = targetSwlWall.media_folder;
    await directus.items('directus_users').updateOne(loggedInUser.id, {
      temporary_write_access_folder: targetMediaFolder,
      temporary_write_access_folder_granted_at: new Date(),
    });
    return respond(200, 'ok', {mid: createMomentCall.id, targetMediaFolder});
  } catch (error) {
    console.log(error);
    await logToSentry(error as Error);
    return respond(400, 'failed');
  }
  // return respond(400, "error")
}
