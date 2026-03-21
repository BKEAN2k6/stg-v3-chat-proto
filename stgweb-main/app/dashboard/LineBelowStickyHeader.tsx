'use client';

import {usePathname} from 'next/navigation';
import {PATHS} from '@/constants.mjs';

type Props = {
  readonly isShown: boolean;
};
export const LineBelowStickyHeader = (props: Props) => {
  const {isShown} = props;

  const pathname = usePathname();

  if (
    !isShown ||
    pathname.startsWith('/dashboard/modal') ||
    pathname.startsWith(PATHS.homeTools)
  )
    return null;

  return (
    <div className="fixed top-[54px] z-20 mx-auto h-[1px] w-screen max-w-[1200px] border-b border-[#e5e7eb] lg:left-[200px]" />
  );
};
