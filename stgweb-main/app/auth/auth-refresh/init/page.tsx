'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {delay} from '@/lib/utils';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';

const DEBUG = process.env.NODE_ENV === 'development';

const TryToRefreshSession = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const returnPath = searchParameters.get('return');

  useLegacyEffect(() => {
    const run = async () => {
      let message = 'nothing';
      try {
        const fetchSessionCall = await fetch(PATHS.authRefresh, {
          method: 'POST',
        });
        const fetchSessionBody = await fetchSessionCall.json();
        message = fetchSessionBody.message;
      } catch (error) {
        console.log(error);
      }

      if (DEBUG) {
        console.log('TryToRefreshSession: message', message);
      }

      //
      switch (message) {
        case 'ok': {
          // console.log(`all good, return to ${returnPath}`)
          await delay(1000);
          window.location.href = returnPath ?? '/';
          // router.push(returnPath || '/')
          break;
        }

        case 'try-again': {
          // console.log(`soft-fail, return to /errors/try-again`)
          router.push(PATHS.tryAgain);
          break;
        }

        case 'nothing':
        case 'failed': {
          // console.log(`failed, return to /errors/invalid-session`)
          router.push(PATHS.invalidSession);
          break;
        }

        default:
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

const AuthRefresh = () => <TryToRefreshSession />;

export default AuthRefresh;
