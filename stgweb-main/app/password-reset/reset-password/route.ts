import {type NextRequest} from 'next/server';
import {checkLoginToken} from '../_utils';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const token = body.token;
  const newPassword = body.password;

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

  try {
    await directus
      .items('directus_users')
      .updateOne(loginToken.user.id, {password: newPassword});
  } catch {
    return respond(400, 'failed');
  }

  try {
    await directus.items('login_token').deleteOne(loginToken.id);
  } catch (error) {
    console.error('failed to remove login token:', (error as Error).message);
  }

  return respond(200, 'ok');
}
