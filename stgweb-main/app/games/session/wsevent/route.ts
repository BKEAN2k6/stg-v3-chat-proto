import {type NextRequest} from 'next/server';
import {
  createServerSideAdminDirectusClient,
  createServerSideDirectusClient,
} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const authToken = request.cookies.get('auth_token')?.value ?? '';

  const userDirectus = await createServerSideDirectusClient({authToken});
  const adminDirectus = await createServerSideAdminDirectusClient();

  let loggedInUser;
  try {
    loggedInUser = await userDirectus.users.me.read({
      fields: ['id'],
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-logged-in-user');
  }

  const wsocEventType = body.eventType;
  const wsocEventListenerValue = body.sessionId;
  const wsocEventLookupValue = body.lookupValue || loggedInUser.id;

  try {
    await adminDirectus.items('websocket_event').createOne({
      user_created: loggedInUser.id,
      type: wsocEventType,
      listener_value: wsocEventListenerValue,
      lookup_value: wsocEventLookupValue,
    });
    return respond(200, 'ok');
  } catch (error) {
    console.error(error);
    return respond(400, 'failed');
  }
}
