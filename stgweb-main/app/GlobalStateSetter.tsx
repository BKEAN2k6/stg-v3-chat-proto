'use client';

import useLegacyEffect from '@/hooks/use-legacy-effect';
import useGlobal from '@/hooks/useGlobal';

export const GlobalStateSetter = () => {
  const {setGlobalState} = useGlobal();
  useLegacyEffect(() => {
    setTimeout(() => {
      setGlobalState({inClient: true});
    }, 1000);
  }, []);
  return null;
};
