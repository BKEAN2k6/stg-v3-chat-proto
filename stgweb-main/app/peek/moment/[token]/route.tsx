// This is the url shared in emails to get a "peek" of moments without having to
// sign in.

// Here we check if the user is already logged in, and if they can access the
// moment with their account. If they can, we redirect them to the actual moment
// display screen, and don't have to show them the peek preview.

// If we do end up going into the peek view path, we move the
// "peek_access_token" from the url to cookies. we do this to make it a bit
// trickier to accidentally share the link with someone else.

import {type NextRequest, NextResponse} from 'next/server';
import {PATHS, PUBLIC_URL} from '@/constants.mjs';
import {createServerSideDirectusClient} from '@/lib/directus';
import {
  authRefresh,
  getUrlFromRequest,
  setAuthCookies,
} from '@/lib/server-only-utils';

type Props = {
  params: {
    token: string;
  };
};

export async function GET(request: NextRequest, props: Props) {
  const url = getUrlFromRequest(request);
  const searchParameters = url.searchParams;
  const mid = searchParameters.get('mid');
  const refreshToken = request.cookies.get('directus_refresh_token')?.value;
  const authToken = request.cookies.get('auth_token')?.value;

  const isLoggedIn = Boolean(authToken);

  const query = mid ? `?mid=${mid}` : '';

  const goToPeekMomentResponse = NextResponse.redirect(
    `${PUBLIC_URL}/peek/moment${query}`,
    {status: 302},
  );

  if (mid && isLoggedIn) {
    // If we are able to determine that we can access the moment directly, we
    // return with this response
    const goToMomentResponse = NextResponse.redirect(
      `${PUBLIC_URL}/${PATHS.inboxMomentDetails.replace('[momentId]', mid)}`,
      {status: 302},
    );
    let authData;
    try {
      authData = await authRefresh({
        refreshToken,
      });
    } catch {}

    //
    if (authData) {
      // check if we can access the moment with our token
      let moment;
      try {
        const directus = await createServerSideDirectusClient({
          authToken: authData.accessToken,
        });
        moment = await directus.items('swl_moment').readOne(mid);
      } catch {}

      if (moment) {
        // if we can, update the auth cookies and return with the response to go to
        setAuthCookies(goToMomentResponse, authData);
        return goToMomentResponse;
      }

      // even if we can not (if user has a different active organization for
      // example), we still need to return with the updated auth data (since we
      // already made the refresh, which invalidates the current refresh
      // token)
      setAuthCookies(goToPeekMomentResponse, authData);
    }
  }

  goToPeekMomentResponse.cookies.set({
    name: 'peek_access_token',
    value: props.params.token,
    httpOnly: false,
    // expire in five minutes
    maxAge: 60 * 5,
  });

  return goToPeekMomentResponse;
}
