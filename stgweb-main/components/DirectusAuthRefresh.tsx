'use client';

import {refreshAuthIfExpired} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useGlobal from '@/hooks/useGlobal';

const DEBUG = process.env.NODE_ENV === 'development';

const DirectusAuthRefresh = () => {
  const {globalState, setGlobalState} = useGlobal();

  const maybeRefresh = async () => {
    if (DEBUG) {
      console.log(
        'DirectusAuthRefresh: renew directus auth if it has expired...',
      );
    }

    const newAuthToken = await refreshAuthIfExpired();
    if (newAuthToken) {
      setGlobalState({...globalState, userAuthToken: newAuthToken});
    }
  };

  useLegacyEffect(() => {
    // there is some random edge case that will fail to get rid of this refresh
    // blocker, basically rendering the local session useless since it wont be
    // refreshed client side if this exists. Clear it here so that at least a
    // hard refresh will get rid of this localStorage item, freeing things to be
    // refreshable again.
    localStorage.removeItem('refreshing_auth');
    //
    const interval = setInterval(maybeRefresh, 10000);
    window.addEventListener('focus', maybeRefresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', maybeRefresh);
    };
  }, []);

  return null;
};

export default DirectusAuthRefresh;
