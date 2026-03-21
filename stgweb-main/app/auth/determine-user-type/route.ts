import {type NextRequest, NextResponse} from 'next/server';
import {ORG_CONTROLLER_ROLE_ID, PUBLIC_URL} from '@/constants.mjs';
import {type UserType} from '@/types/auth';
import {createServerSideDirectusClient} from '@/lib/directus';
import {getUrlFromRequest} from '@/lib/server-only-utils';

export async function GET(request: NextRequest) {
  const {searchParams} = getUrlFromRequest(request);
  const returnPath = searchParams.get('return');

  const response = NextResponse.redirect(`${PUBLIC_URL}${returnPath}`);

  const authToken = request.cookies.get('auth_token')?.value ?? '';
  let directus;
  let user;
  try {
    directus = await createServerSideDirectusClient({authToken});
    user = await directus?.users.me.read();
  } catch (error) {
    console.error(error);
  }

  let userType: UserType = 'dashboard-user';

  if (user?.role === ORG_CONTROLLER_ROLE_ID) {
    userType = 'org-controller-user';
  }

  if (user?.is_strength_session_user) {
    userType = 'strength-session-user';
  }

  // NOTE: this HAS to set a user type cookie, otherwise we will be in a redirect loop
  // so even if something above fails, we should set the default value here (dashboard-user)

  response.cookies.set({
    name: 'user_type',
    value: userType,
    httpOnly: false,
    maxAge: 2147483647, // "never" expire
  });

  return response;
}
