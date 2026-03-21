'use client';

// see https://docs.directus.io/self-hosted/sso.html#seamless-sso
import {useRouter} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {moveAuthTokensFromClientToServer, refreshAuth} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';

const DirectusAuthRefresh = () => {
  const router = useRouter();
  useLegacyEffect(() => {
    const run = async () => {
      await refreshAuth();
      const authToken = localStorage.getItem('auth_token') ?? '';
      const authExpires = Number.parseInt(localStorage.getItem('auth_expires') ?? '0', 10) || 0; // prettier-ignore
      await moveAuthTokensFromClientToServer(authToken, authExpires);
      router.push(PATHS.profile);
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
