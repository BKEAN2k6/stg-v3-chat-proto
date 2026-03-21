'use client';

import {usePathname} from 'next/navigation';
import {shouldHideNavigation} from '@/lib/navigation';

export const BottomNavigationOffset = () => {
  const pathname = usePathname();
  if (shouldHideNavigation(pathname)) {
    return null;
  }

  return <div className="h-24 lg:h-0" />;
};
