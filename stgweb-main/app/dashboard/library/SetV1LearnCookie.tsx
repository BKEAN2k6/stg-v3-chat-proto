'use client';

import {useEffect} from 'react';
import {useCookies} from 'next-client-cookies';
import {cookieDomain} from '@/lib/utils';

export const SetV1LearnCookie = () => {
  const cookies = useCookies();

  useEffect(() => {
    cookies.set('v1learn', 'kfk3832ngvdsQoerhA938Gr', {
      expires: 365,
      domain: cookieDomain(),
    });
  }, [cookies]);

  return null;
};
