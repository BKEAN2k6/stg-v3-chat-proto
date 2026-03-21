import {useEffect, useRef} from 'react';

const IS_DEVELOPMENT =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const useLegacyEffect = (cb: any, deps: any) => {
  const isMountedRef = useRef(!IS_DEVELOPMENT);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return undefined;
    }

    return cb();
  }, deps);
};

export default useLegacyEffect;
