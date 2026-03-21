'use client';

// This page attempts fix to a broken client session. User will end up here if
// the auth_token in their localStorage is missing (see
// AuthTokenMismatchRedirect). Client session would most likely be missing due
// to some shenanigans pulled by the directus SDK.
import {useRouter, useSearchParams} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {createClientSideDirectusClient} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';

const DirectusAuthRefresh = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  useLegacyEffect(() => {
    const run = async () => {
      const directus = createClientSideDirectusClient();
      try {
        await directus.auth.refresh();
        let returnPath;
        if (!searchParameters.get('return')?.startsWith('/errors')) {
          returnPath = searchParameters.get('return');
        }

        router.push(returnPath ?? PATHS.profile);
      } catch {
        // This piece of state is stored due to the fact that if this fails, we
        // really don't want to try again, since in that case the users
        // credentials just are bad and need to be renewed anyway...
        localStorage.setItem('attemptedToFixSession', '1');
        router.push('/');
      }
    };

    if (typeof window !== 'undefined') {
      run();
    }
  }, []);

  return (
    <div className="min-safe-h-screen flex w-screen items-center justify-center bg-primary">
      <Loader />
    </div>
  );
};

const AuthOauthSkolonPage = () => <DirectusAuthRefresh />;

export default AuthOauthSkolonPage;
