'use client';

import {usePathname, useRouter} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import useLegacyEffect from '@/hooks/use-legacy-effect';

const DEBUG = process.env.NODE_ENV === 'development';

// NOTE: With some other updates to the way auth token refresh works, this is
// likely not even necessary anymore. Basically if we don't use the autoRefresh
// of Directus SDK, we won't "lose" the auth tokens, thus not needing this kind
// of a thing any longer. It is not really an issue to have it in place, but
// just to note that it isn't probably important to have this logic...

export const AuthTokenMismatchRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  useLegacyEffect(() => {
    const run = async () => {
      const serverHasAuthToken = document.body.classList.contains(
        'server-has-auth-token',
      );
      const clientHasAuthToken = Boolean(localStorage.getItem('auth_token'));
      if (DEBUG) {
        console.log('AuthTokenMismatchRedirect: serverHasAuthToken', serverHasAuthToken); // prettier-ignore
        console.log('AuthTokenMismatchRedirect: clientHasAuthToken', clientHasAuthToken); // prettier-ignore
      }

      // If auth_token from the client is missing, redirect to a page that'll
      // try to fix it (this can happen due to quirks in directus SDK, if the
      // user manages to for example time his refresh exactly in the middle of a
      // token refresh action...)
      if (
        serverHasAuthToken &&
        !clientHasAuthToken &&
        pathname !== PATHS.moveAuthTokenFromServerToClient
      ) {
        if (DEBUG) {
          console.log('AuthTokenMismatchRedirect: push server-to-client');
        } // prettier-ignore

        router.push(
          `${PATHS.moveAuthTokenFromServerToClient}?return=${encodeURIComponent(
            pathname,
          )}`,
        );
      }
    };

    if (!localStorage.getItem('attemptedToFixSession')) {
      run();
    }
  }, []);
  return null;
};
