import {cookies, headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {type NextRequest, NextResponse} from 'next/server';
import {type Directus, type IAuth, type TypeMap} from '@directus/sdk';
import {
  SERVER_SIDE_DIRECTUS_URL,
  createServerSideAdminDirectusClient,
  createServerSideDirectusClient,
} from './directus';
import {get} from './utils';
import {PATHS, PUBLIC_URL} from '@/constants.mjs';

const DEBUG = process.env.NODE_ENV === 'development';

export function getUrlFromRequest(request: NextRequest) {
  const isHTTPS = PUBLIC_URL.startsWith('https');
  const protocol = isHTTPS ? 'https' : 'http';
  const headerHost = request?.headers.get('Host');
  // Handle local environments (so the logic can be tested when adding
  // local-dev-hosts.txt values to /etc/hosts). We need this because req.url or
  // req.nextUrl will always be localhost:3000/* on the local environment even
  // when using a custom domain.
  if (process.env.NODE_ENV === 'development') {
    const url = request.nextUrl;
    return new URL(`${protocol}://${headerHost}${url.pathname}${url.search}`);
  }

  return new URL(request.url || '', `${protocol}://${headerHost}`);
}

export function parseCookieValue(
  setCookieHeader: string,
  cookieName: string,
): string | undefined {
  const cookies = setCookieHeader
    .split(',')
    .map((cookieString) => cookieString.split(';')[0].split('='));
  const cookiePair = cookies.find(([name]) => name.trim() === cookieName);

  return cookiePair ? decodeURIComponent(cookiePair[1]) : undefined;
}

// just making sure we get the latest cookie even if it was set on the same request
export function getCookieValueFromHeadersOrStorage(key: string) {
  const headersList = headers();
  const setCookieHeader = headersList.get('set-cookie');
  const userCookies = cookies();
  const authTokenInSetCookieHeader = parseCookieValue(
    setCookieHeader ?? '',
    key,
  );
  const authTokenInStoredCookies = userCookies.get(key)?.value;
  return authTokenInSetCookieHeader ?? authTokenInStoredCookies ?? '';
}

export async function serverDataQueryWrapper<U>(
  currentPath: string,
  func: (directus: Directus<TypeMap, IAuth>) => U,
) {
  const authToken = getCookieValueFromHeadersOrStorage('auth_token');
  // user has not logged in, no need to do anything here
  if (authToken === '') {
    if (currentPath !== '/') {
      // NOTE: this will not work if we ever need to fetch anything server side
      // for non-logged-in users, but as there currently aren't any of those
      // cases, this is good enough.
      if (DEBUG) {
        console.log('serverDataQueryWrapper: redirect to root');
      }

      redirect('/');
    }

    return;
  }

  try {
    const directus = await createServerSideDirectusClient({
      authToken,
    });
    return func(directus);
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (DEBUG) {
      console.log('serverDataQueryWrapper: fetch error from page', currentPath, errorMessage);
    } // prettier-ignore

    // NOTE: being quite mindful with the redirection here. We should only take
    // user to this new page if something that we are aware of happens. Unknown
    // / unexpected errors are a bit of a different case, and most often it's
    // better to do nothing and just wait for it to go away...
    if (
      ['Invalid user credentials.', 'Token expired.'].includes(errorMessage)
    ) {
      // Generally we should never get a these kinds of errors (since the client
      // should refresh the token before we get here, and user should not have
      // invalid tokens stored). There are some edge cases where client fails to
      // do this. In those cases we redirect the user to a path that attempts to
      // refresh the token.
      if (DEBUG) {
        console.log('serverDataQueryWrapper: redirect to auth-refresh');
      } // prettier-ignore

      // @TODO redirect to "try again" path
      redirect(`${PATHS.authRefreshInit}?return=${currentPath}`);
    } else {
      // await logToSentry(err as Error)
      console.error(error);
    }
  }
  // console.log("me", me)
  // await directus.users.me.read()
}

export async function adminServerDataQueryWrapper<U>(
  func: (directus: Directus<TypeMap, IAuth>) => U,
) {
  // no unauthenticated redirect needed, since admin should always have a valid token
  try {
    const directus = await createServerSideAdminDirectusClient();
    return func(directus);
  } catch (error) {
    const message = (error as Error).message;
    console.error(message);
    // no failure redirect needed, since admin should always have a valid token
  }
}

export type AuthData = {
  refreshToken: string;
  accessToken: string;
  expires: number;
};

export async function authRefresh({refreshToken}: {refreshToken?: string}) {
  if (!refreshToken) {
    throw new Error('no refresh token');
  }

  if (DEBUG) {
    console.log('authRefresh: try to refresh auth');
  }

  if (DEBUG) {
    console.log('authRefresh: refreshToken', refreshToken);
  }

  const refreshCall = await fetch(`${SERVER_SIDE_DIRECTUS_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      mode: 'json',
    }),
  });
  const refreshCallBody = await refreshCall.json();
  if (
    refreshCallBody.data?.refresh_token &&
    refreshCallBody.data?.access_token &&
    refreshCallBody.data?.expires
  ) {
    const authData = {
      refreshToken: refreshCallBody.data?.refresh_token,
      accessToken: refreshCallBody.data?.access_token,
      expires: refreshCallBody.data?.expires,
    };
    return authData;
  }

  // if we explicitly get the "Invalid user credentials." error, users token has likely been refreshed elsewhere
  const invalidCredsError = 'Invalid user credentials.';
  if (get(refreshCallBody, 'errors[0].message') === invalidCredsError) {
    if (DEBUG) {
      console.log('authRefresh: possible double session');
    } // prettier-ignore

    throw new Error('invalid-credentials');
  }
}

export function setAuthCookies(response: NextResponse, authData: AuthData) {
  response.cookies.set({
    name: 'directus_refresh_token',
    value: authData.refreshToken,
    httpOnly: true,
    maxAge: 2147483647, // "never" expire
  });
  response.cookies.set({
    name: 'auth_token',
    value: authData.accessToken,
    httpOnly: true,
    maxAge: 2147483647, // "never" expire
  });
  response.cookies.set({
    name: 'auth_expires_at',
    value: String(Date.now() + authData.expires),
    httpOnly: true,
    maxAge: 2147483647, // "never" expire
  });
  response.cookies.set({
    name: 'auth_token_last_refreshed_at',
    value: String(Date.now()),
    httpOnly: true,
    maxAge: 2147483647, // "never" expire
  });
}

export async function getLoggedInUser(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value ?? '';

  if (!authToken) {
    return;
  }

  try {
    const userDirectus = await createServerSideDirectusClient({authToken});
    const loggedInUser = await userDirectus.users.me.read();
    return loggedInUser;
  } catch {
    console.error('failed to fetch user data');
  }
}

export function respond(status: number, message: string, data?: any) {
  return NextResponse.json(
    {
      message,
      ...data,
    },
    {status},
  );
}
