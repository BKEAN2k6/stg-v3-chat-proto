import {useEffect} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {PATHS} from '@/constants.mjs';

export const PreventNavigationBack = () => {
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const router = useRouter();

  const preventGoingBackToFirstTour = () => {
    // if user navigates back so that they land to "intro1", we should actually be moving to intro2
    if (
      pathname === PATHS.profile &&
      searchParameters.get('tour') === 'intro1'
    ) {
      router.push(`${PATHS.profile}?tour=intro2`);
      window.removeEventListener('popstate', preventGoingBackToFirstTour);
    }

    // if user navigates back so that they land to "intro2", the whole tour query param should be removed
    if (
      pathname === PATHS.profile &&
      searchParameters.get('tour') === 'intro2'
    ) {
      router.push(PATHS.profile);
      window.removeEventListener('popstate', preventGoingBackToFirstTour);
    }
  };

  useEffect(() => {
    window.addEventListener('popstate', preventGoingBackToFirstTour);
  }, []);

  return null;
};
