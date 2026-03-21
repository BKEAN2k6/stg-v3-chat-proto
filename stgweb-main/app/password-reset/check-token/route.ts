import {type NextRequest} from 'next/server';
import {checkLoginToken} from '../_utils';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const token = body.token;

  const directus = await createServerSideAdminDirectusClient();

  let loginToken;
  try {
    loginToken = await checkLoginToken(directus, token);
  } catch (error) {
    const message = (error as Error).message;
    return respond(400, message);
  }

  if (!loginToken) {
    return respond(500, 'did-not-get-login-token');
  }

  const userEmail = loginToken.user.email;

  return respond(200, 'ok', {userEmail});
}
