'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {ADMIN_PATHS} from '../../admin/admin-paths';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';

const DEBUG = process.env.NODE_ENV === 'development';

export const LogoutRedirect = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();

  let target = '/';
  if (searchParameters.get('source') === 'admin') {
    target = ADMIN_PATHS.login;
  }

  useLegacyEffect(() => {
    const run = async () => {
      // clean up the directus session (auth tokens in local storage and session in db)
      try {
        // NOTE: directus.auth.logout requires a valid token, so we need to
        // refresh if expired before attempting to logging out through
        // Directus...
        const directus = createClientSideDirectusClient();
        await refreshAuthIfExpired();
        await directus.auth.logout();
      } catch {
        if (DEBUG) {
          console.log('LogoutRedirect - client logout failed...');
        } // prettier-ignore

        // client side logout failed - remove tokens...
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_expires');
        localStorage.removeItem('auth_expires_at');
      }

      // clean up the http cookies used for server side auth (works even if session has expired)
      await fetch('/auth/server-logout', {
        method: 'POST',
      });

      // "hard redirect" so new state is properly picked up (next router won't do here)
      window.location.href = target;
    };

    run();
  }, [router, target]);

  return null;
};
