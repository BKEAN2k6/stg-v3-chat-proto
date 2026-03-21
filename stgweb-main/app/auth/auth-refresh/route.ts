import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import {logToSentry} from '@/lib/log';
import {authRefresh, setAuthCookies} from '@/lib/server-only-utils';

const DEBUG = process.env.NODE_ENV === 'development';

export async function POST() {
  const userCookies = cookies();

  const refreshToken = userCookies.get('directus_refresh_token')?.value;
  const authTokenLastRefreshedAt = userCookies.get('auth_token_last_refreshed_at')?.value; // prettier-ignore

  const successResponse = NextResponse.json({message: 'ok'});
  const hardFailureResponse = NextResponse.json({message: 'failed'});
  const softFailureResponse = NextResponse.json({message: 'try-again'});

  // const returnPath = request.nextUrl.searchParams.get("return")

  // const successResponse = NextResponse.redirect(
  //   `${PUBLIC_URL}/${returnPath ? returnPath : ""}`, { status: 302 }
  // )
  // const hardFailureResponse = NextResponse.redirect(
  //   `${PUBLIC_URL}/errors/invalid-session`, { status: 302 }
  // )
  // const softFailureResponse = NextResponse.redirect(
  //   `${PUBLIC_URL}/errors/try-again`, { status: 302 }
  // )

  // helper function to call if refresh fails or we get an invalid response from it
  function clearAuthData() {
    hardFailureResponse.cookies.set({
      name: 'directus_refresh_token',
      value: '',
      httpOnly: true,
      maxAge: -1,
    });
    hardFailureResponse.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      maxAge: -1,
    });
    hardFailureResponse.cookies.set({
      name: 'auth_expires_at',
      value: '',
      httpOnly: true,
      maxAge: -1,
    });
    hardFailureResponse.cookies.set({
      name: 'auth_token_last_refreshed_at',
      value: '',
      httpOnly: true,
      maxAge: -1,
    });
  }

  // don't allow this to get stuck in a refresh loop...
  const lastRefresh =
    authTokenLastRefreshedAt && Number.parseInt(authTokenLastRefreshedAt, 10);
  const now = Date.now();
  const lastRefreshMoreThanFiveSecondsAgo =
    lastRefresh && Math.abs(lastRefresh - now) > 5000;

  if (lastRefresh && !lastRefreshMoreThanFiveSecondsAgo) {
    return hardFailureResponse;
  }

  try {
    const authData = await authRefresh({
      refreshToken,
    });
    if (!authData) {
      throw new Error('No auth data returned from refresh call');
    }

    setAuthCookies(successResponse, authData);
    return successResponse;
  } catch (error) {
    const message = (error as Error).message;
    if (['invalid-credentials', 'no refresh token'].includes(message)) {
      clearAuthData();
      return hardFailureResponse;
    }

    if (DEBUG) {
      console.log('auth-refresh: refresh call threw an unknown error', (error as Error).message);
    } // prettier-ignore

    console.error(error);
    await logToSentry(error as Error);
    return softFailureResponse;
    // Refresh call failed. This is likely caused by a network error or
    // backend being temporarily inaccessible, so don't clear the users session
    // just yet (we could probably send the user to a "temporary error" page
    // and allow them to try again...)
    //
    // @TODO log this as an error somewhere, the backend is likely down
  }
}
