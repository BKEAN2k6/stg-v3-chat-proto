import {Directus} from '@directus/sdk';
import {DATA_API_URL, PUBLIC_URL} from '@/constants.mjs';

export const PROXIED_DIRECTUS_PATH = '/data-api';

// The CLIENT_SIDE_DIRECTUS_URL points to the same domain as the UI
// (PUBLIC_URL), so it's possible to pass around cookies.
export const SERVER_SIDE_DIRECTUS_URL = DATA_API_URL;

// The SERVER_SIDE_DIRECTUS_URL (which just directly points to the directus
// instance) is necessary during the build phase for certain paths to be able to
// prerender when nothing but the directus instance is running.
export const CLIENT_SIDE_DIRECTUS_URL = `${PUBLIC_URL}${PROXIED_DIRECTUS_PATH}`;

const DEBUG = process.env.NODE_ENV === 'development';

// BASICS

const msRefreshBeforeExpires = 30000;

// NOTE: this ISN'T async
export function createClientSideDirectusClient() {
  const directus = new Directus(PROXIED_DIRECTUS_PATH, {
    auth: {
      // Because we handle the token refreshing manually due to some issues with
      // how Directus does it, we don't want to enable the autoRefresh either.
      // It's easy enough to use the refreshIfExpired helper before making calls
      // with Directus.
      autoRefresh: false,
      msRefreshBeforeExpires,
    },
  });
  return directus;
}

export async function refreshAuthIfExpired({force}: {force?: boolean} = {}) {
  // NOTE: some logic from directus SDK replicated here. There is a helper
  // function directus.auth.refreshIfExpired(), but since we need to be able to
  // detect if the renew call is going through to also call the client-to-server
  // after it, we need to replicate the logic of that helper here...

  // Make sure authExpiresAt and msRefreshBeforeExpires are correct and same as
  // what SDK uses
  const authExpiresAt = Number.parseInt(localStorage.getItem('auth_expires_at') ?? '0', 10) || 0; // prettier-ignore
  if (authExpiresAt < Date.now() + msRefreshBeforeExpires) {
    try {
      // the Directus SDK auth.refresh is a bit problematic, since the first
      // thing it does is that it removes the existing auth tokens for some
      // reason. If the server is just down for a while or unreachable (due to
      // network issues etc.), we've just cleared the users session... That's
      // why we have a separate helper to do this directly with the API without
      // that await directus.auth.refresh()
      await refreshAuth({force});
      const authToken = localStorage.getItem('auth_token') ?? '';
      const authExpires = Number.parseInt(localStorage.getItem('auth_expires') ?? '0', 10) || 0; // prettier-ignore
      await moveAuthTokensFromClientToServer(authToken, authExpires);
      return authToken;
    } catch (error) {
      const message = (error as Error).message;
      if (DEBUG) {
        console.log('failed to refresh token, failed with message:', message);
      } // prettier-ignore
    }
  }

  return null;
}

// NOTE: this IS async (since it needs to await for auth)
export async function createServerSideDirectusClient(parameters: {
  authToken: string;
}) {
  const directus = new Directus(SERVER_SIDE_DIRECTUS_URL, {
    auth: {
      autoRefresh: false,
    },
  });
  await directus.auth.static(parameters.authToken);
  return directus;
}

// NOTE: this IS async (since it needs to await for auth)
// @TODO: this is to be replaced with a more limited access setup based on users
// + roles that have limited access to the thing that they need to do (which can
// then be used with login + createServerSideDirectusClient combo)
export async function createServerSideAdminDirectusClient() {
  const directus = new Directus(SERVER_SIDE_DIRECTUS_URL, {
    auth: {
      autoRefresh: false,
    },
  });
  await directus.auth.login({
    email: process.env.DIRECTUS_SUPERADMIN_EMAIL ?? 'admin@positive.fi',
    password: process.env.DIRECTUS_SUPERADMIN_PASS ?? 'local-admin-pass1',
  });
  return directus;
}

// HELPERS (client-side)
// @TODO: can lead to odd situations where we are logged in client-side but not
// server side. Figure out a way to deal with those...
export async function moveAuthTokensFromClientToServer(
  accessToken: string,
  expires: number,
) {
  // call an endpoint to store the access token as a cookie, so we can use it
  // with server-side requests
  if (accessToken && accessToken.trim() !== '') {
    await fetch('/auth/client-to-server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        expires,
      }),
    });
  } else if (DEBUG) {
    console.log(
      'moveAuthTokensFromClientToServer: did not move empty auth token to server',
    );
  }
}

export async function refreshAuth({force}: {force?: boolean} = {}) {
  // block simultaneus calls to refresh auth to prevent race conditions
  if (force ?? localStorage.getItem('refreshing_auth') !== 't') {
    localStorage.setItem('refreshing_auth', 't');
    const refreshCall = await fetch(
      `${CLIENT_SIDE_DIRECTUS_URL}/auth/refresh`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    const refreshCallBody: {data?: {access_token: string; expires: number}} =
      await refreshCall.json();
    // console.log("refreshCallBody", refreshCallBody)
    if (refreshCallBody.data?.access_token && refreshCallBody.data?.expires) {
      // set new cookies
      localStorage.setItem('auth_token', refreshCallBody.data.access_token);
      localStorage.setItem(
        'auth_expires',
        refreshCallBody.data.expires.toString(),
      );
      localStorage.setItem(
        'auth_expires_at',
        (Date.now() + refreshCallBody.data.expires).toString(),
      );
    }

    localStorage.removeItem('refreshing_auth');
  } else if (DEBUG) {
    console.log('refreshAuth: already refreshing');
  }
}

// async function createOneWithRetry(directus: any, collection: string, data: any) {
//   try {
//     return await directus.items(collection).createOne(data);
//   } catch (err) {
//     if (err.message === "Token expired") {
//       await directus.auth.refresh();
//       return await directus.items(collection).createOne(data);
//     } else {
//       throw err;
//     }
//   }
// }

export async function directusClientSideLogin(parameters: {
  email: string;
  password: string;
}) {
  const directus = createClientSideDirectusClient();
  const authCall = await directus.auth.login({
    email: parameters.email,
    password: parameters.password,
  });
  await moveAuthTokensFromClientToServer(
    authCall.access_token,
    authCall.expires,
  );
  return authCall;
}

// @TODO: refactoring note, this will become a slow thing to run as the
// organization and group count grows...
export async function getAvailableJoinShortCode(directus: any) {
  const organizationQuery = await directus.items('organization').readByQuery({
    fields: ['join_short_code'],
  });
  const organizationJoinShortCodes = organizationQuery?.data.map(
    (org: any) => org.join_short_code,
  );
  const groupQuery = await directus.items('group').readByQuery({
    fields: ['join_short_code'],
  });
  const groupJoinShortCodes = groupQuery?.data.map(
    (grp: any) => grp.join_short_code,
  );
  const allJoinShortCodes = new Set([
    ...organizationJoinShortCodes,
    ...groupJoinShortCodes,
  ]);

  let newJoinShortCode;
  do {
    newJoinShortCode = Math.floor(100000 + Math.random() * 900000);
  } while (allJoinShortCodes.has(newJoinShortCode));

  return newJoinShortCode;
}
