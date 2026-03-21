import {NextResponse, type NextRequest} from 'next/server';
import {PUBLIC_URL, SHORT_DOMAIN} from './constants.mjs';
import {getUrlFromRequest} from './lib/server-only-utils';
import {type LanguageCode, mapLanguageCodeToLocaleCode} from '@/lib/locale';

const DEBUG = process.env.NODE_ENV === 'development';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - apple-touch-icon.png
     * - data-api
     * - animations
     */
    '/((?!api|_next/static|_next/image|favicon.ico|data-api|animations|apple-touch-icon.png|images).*)',
  ],
};

// LANGUAGE REDIRECT
// checks if user is in one of the paths that are supposed to be used as the
// entry points for setting a language and redirect user

// AUTH REDIRECT
// Checks for auth token existence and redirects non-logged in users away from
// logged in users paths and the other way around as well.

// eslint-disable-next-line complexity
export async function middleware(request: NextRequest) {
  const {hostname, pathname, search} = getUrlFromRequest(request);
  const query = search || '';

  const responseNext = NextResponse.next();

  // SHORT DOMAIN REDIRECT

  if (hostname === SHORT_DOMAIN && !pathname.startsWith('/pick-language')) {
    return NextResponse.redirect(`${PUBLIC_URL}/pick-language${query}`);
  }

  // LANGUAGE DOMAIN REDIRECT
  // NOTE: even though we generally present the users with the stg.fun link
  // directly and allow them to choose a language themselves when opening the
  // page, these language specific links are still necessary for for example
  // emails, where we have the language of the user in the url to be able to
  // redirect them directly to a page with the correct language (for example if
  // an email notification to open a message received is opened from a mobile
  // device where the user hasn't previously visited the platform)

  // This was changed from x.seethegood.app to x.stg.fun, since the
  // seethegood.app language subdomains were needed for the website language
  // versions.

  const EN_PROD_HOSTNAME = 'en.stg.fun';
  const SV_PROD_HOSTNAME = 'sv.stg.fun';
  const FI_PROD_HOSTNAME = 'fi.stg.fun';
  const EN_STAGING_HOSTNAME = 'en.beta.stg.fun';
  const SV_STAGING_HOSTNAME = 'sv.beta.stg.fun';
  const FI_STAGING_HOSTNAME = 'fi.beta.stg.fun';
  const EN_DEV_HOSTNAME = 'en.dev.stg.fun';
  const SV_DEV_HOSTNAME = 'sv.dev.stg.fun';
  const FI_DEV_HOSTNAME = 'fi.dev.stg.fun';

  // local testing:
  // - add relevant domains to /etc/host (see local-dev-hosts.txt)
  // - uncomment few lines on top of constants.mjs (publicDomain and sharedCookieDomain)
  // - when that is done:
  // http://fi.dev.stg.fun:3000/login should take one to dev.seethegood.fi:3000/login and page should be in Finnish
  // http://en.dev.stg.fun:3000/login should take one to dev.seethegood.fi:3000/login and page should be in English

  if (
    [
      EN_PROD_HOSTNAME,
      SV_PROD_HOSTNAME,
      FI_PROD_HOSTNAME,
      EN_STAGING_HOSTNAME,
      SV_STAGING_HOSTNAME,
      FI_STAGING_HOSTNAME,
      EN_DEV_HOSTNAME,
      SV_DEV_HOSTNAME,
      FI_DEV_HOSTNAME,
    ].includes(hostname) &&
    !pathname.startsWith('/utils/set-locale')
  ) {
    const language = hostname.split('.')[0] as LanguageCode;
    const locale = mapLanguageCodeToLocaleCode[language];
    // NOTE: now that the language domain is different from the actual domain to
    // be used, we can't set the cookie here, but instead we need to redirect
    // the user to a path on the target domain that sets to cookie and redirects
    // them back to where they wanted to go
    const targetPath = encodeURIComponent(String(pathname) + query);
    return NextResponse.redirect(
      `${PUBLIC_URL}/utils/set-locale/${locale}?target=${targetPath}`,
    );
  }

  // AUTH REDIRECT

  const userType = request.cookies.get('user_type')?.value;
  const authToken = request.cookies.get('auth_token')?.value;
  const refreshToken = request.cookies.get('directus_refresh_token')?.value;
  const authExpiresAt = Number.parseInt(
    request.cookies.get('auth_expires_at')?.value ?? '0',
    10,
  );

  if (DEBUG) {
    console.log(`middleware: path ${pathname}`);
  }

  // assume user is not logged in at first
  let isLoggedIn = false;

  // something is missing, user is likely not logged in
  const missingAuthData = !authToken || !refreshToken || authExpiresAt === 0;

  if (!missingAuthData) {
    // since user has all the necessary data, assume user is logged in
    isLoggedIn = true;
  }

  if (DEBUG) {
    console.log('middleware: isLoggedIn', isLoggedIn);
  }

  // handle redirects for non-logged-in user
  // NOTE: see below for logged-in users
  if (!isLoggedIn) {
    // redirect to a special page from all pages considered to be for
    // authenticated users only NOTE: there's a separate page so that we don't
    // get "dead links" (if we'd directly redirect to "/"", and one would
    // somehow be able to click a link to for example the "/onboard" from the
    // "/" page while not logged in, nothing would happen, since the the
    // redirect happens before being taken to the new page...)
    // Also redirect away from the special page for already logged in users if
    // we are not actually logged in
    if (
      (pathname.startsWith('/dashboard') ||
        pathname.startsWith('/onboard') ||
        pathname.startsWith('/errors/already-logged-in')) &&
      pathname !== '/errors/login-needed'
    ) {
      return NextResponse.redirect(`${PUBLIC_URL}/errors/login-needed`);
    }

    return responseNext;
  }

  // handle redirects for logged-in user
  // NOTE: paths under /auth are allowed for every user type! (contains things
  // for user session management, such as logout)
  if (isLoggedIn && !pathname.startsWith('/auth')) {
    // if user doesn't have a user_type cookie, we need to create one. This
    // should only happen once for users that have been logged in before the
    // update with user_type cookies went live (or if user has managed to remove
    // the user_type cookie somehow, but that requires users to manually do it)
    if (!userType && !pathname.startsWith('/auth/determine-user-type')) {
      return NextResponse.redirect(
        `${PUBLIC_URL}/auth/determine-user-type?return=${encodeURIComponent(
          pathname + search,
        )}`,
      );
    }

    if (userType === 'dashboard-user') {
      // Don't let dashboard-users that are logged in to get into places that
      // are meant only for unauthenticated visitors.
      // NOTE: all other paths are available for dashboard-user types!
      // (blacklist instead of whitelist as opposed to the other user types)
      if (
        (pathname.startsWith('/login') ||
          pathname.startsWith('/errors/login-needed') ||
          pathname.startsWith('/password-reset')) &&
        pathname !== '/errors/already-logged-in'
      ) {
        return NextResponse.redirect(`${PUBLIC_URL}/errors/already-logged-in`);
      }

      // don't let dashboard-users in to the admin parts
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(`${PUBLIC_URL}/dashboard/profile`);
      }
    }

    if (
      userType === 'strength-session-user' && // Allow session users to only be in the /games/session/player or
      // /games/session/shared paths. If they stumble upon any other path, take
      // them to an error page that let's them choose what to do next.

      !pathname.startsWith('/games/session/player') &&
      !pathname.startsWith('/games/session/shared') &&
      pathname !== '/errors/session-user-info'
    ) {
      return NextResponse.redirect(`${PUBLIC_URL}/errors/session-user-info`);
    }

    if (
      userType === 'org-controller-user' && // logged in org controllers should only be able to access routes within the /admin path
      !pathname.startsWith('/admin/organizations')
    ) {
      return NextResponse.redirect(`${PUBLIC_URL}/admin/organizations`);
    }
  }

  return responseNext;
}
