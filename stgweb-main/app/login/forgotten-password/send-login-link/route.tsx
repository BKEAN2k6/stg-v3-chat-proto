import crypto from 'node:crypto';
import {type NextRequest} from 'next/server';
import {PATHS, PUBLIC_URL, USER_ROLE_ID} from '@/constants.mjs';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {queueEmail} from '@/lib/email';
import {getLocaleCode} from '@/lib/locale';
import {respond} from '@/lib/server-only-utils';

const DEBUG = process.env.NODE_ENV === 'development';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const locale = getLocaleCode(request.cookies.get('locale')?.value);

  const email = body.email;

  const directus = await createServerSideAdminDirectusClient();

  // check if user exists
  let usersQuery;
  try {
    usersQuery = await directus.items('directus_users').readByQuery({
      fields: ['id', 'first_name', 'email', 'role'],
      filter: {email},
    });
  } catch (error) {
    console.log(error);
    return respond(400, 'failed-to-fetch-user');
  }

  if (!usersQuery.data?.length) {
    return respond(400, 'user-not-found');
  }

  const user = usersQuery.data?.[0];

  // only allow users in the "User" role to be able to reset passwords
  if (user.role !== USER_ROLE_ID) {
    return respond(400, 'invalid-role');
  }

  if (DEBUG) {
    console.log('POST send-login-link user:', user);
  }

  // check if user already has a token that has not expired

  let loginTokenQuery;
  try {
    loginTokenQuery = await directus.items('login_token').readByQuery({
      fields: ['expires_at', 'user.id', 'user.email'],
      filter: {
        user: user.id,
        scope: 'password-reset',
      },
    });
  } catch {
    throw new Error('failed-to-fetch-login-token');
  }

  const now = new Date();
  const loginToken = loginTokenQuery?.data?.[0];

  if (loginToken) {
    const loginTokenExpiration = new Date(loginToken.expires_at);
    if (now < loginTokenExpiration) {
      return respond(400, 'valid-login-token-exists');
    }
  }

  // send out a new login token

  const randomTokenString = crypto.randomBytes(32).toString('hex');
  const newLoginToken = `${Date.now()}_${randomTokenString}`;

  const timeIn24Hours = new Date();
  timeIn24Hours.setHours(timeIn24Hours.getHours() + 24);

  try {
    directus.items('login_token').createOne({
      user: user.id,
      scope: 'password-reset',
      token: newLoginToken,
      expires_at: timeIn24Hours,
    });
  } catch (error) {
    console.log(error);
    return respond(400, 'failed-to-create-login-token');
  }

  const templateByLocale = `Password reset (${locale})`;

  try {
    await queueEmail(directus, {
      deliverImmediately: true,
      toAddress: user.email,
      templateName: templateByLocale,
      templateProps: {
        firstName: user?.first_name || '',
        url: `${PUBLIC_URL}${PATHS.passwordReset}?token=${newLoginToken}`,
      },
    });
  } catch (error) {
    console.log(error);
    return respond(400, 'failed-to-deliver-email');
  }

  return respond(200, 'ok');
}
