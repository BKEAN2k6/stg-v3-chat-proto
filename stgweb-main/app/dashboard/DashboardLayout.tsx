'use client';

import {type ReactNode, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {useWindowSize} from 'react-use';
import {shouldHideNavigation} from '@/lib/navigation';
import useDashboard from '@/hooks/useDashboard';
import {cn} from '@/lib/utils';

type DashboardLayoutMainProps = {
  readonly hasSidebarsOnSide: 'left' | 'right' | 'both';
  readonly children: ReactNode;
};

// This is used to create the main dashboard layout with both left and right
// sides being fixed. Left side is fixed until md, right side is fixed until
// lg...

// This is quite inflexible, since both of these components are quite
// tightly coupled... Changing breakpoints etc. is not really possible with
// this.

// Sidebar on the left is 220px wide, sidebar on the right is 200px wide. These
// values are hardcoded so that Tailwind can pick them up. Be mindful when
// making changes, changes need to be made in multiple places in this file and
// there is some calculation needed!

export const DashboardLayoutMain = (props: DashboardLayoutMainProps) => {
  const {children, hasSidebarsOnSide} = props;

  // this is not needed with the new layout, so if that feature is in use, skip and just return a div
  const {dashboardState} = useDashboard();
  if (dashboardState.useNov23StructureUpdate) {
    return <div className="relative w-full">{children}</div>;
  }

  // NOTE: sidebar width needs to match and it can't be extracted to variable
  // (since tailwind wont pick it up)
  if (hasSidebarsOnSide === 'right') {
    // prettier-ignore
    return (
      <div className='w-full lg:w-[calc(100%_-_300px)]'>
        {children}
      </div>
    );
  }

  if (hasSidebarsOnSide === 'left') {
    return (
      <div className="relative w-full md:left-[220px] md:w-[calc(100%_-_220px)]">
        {children}
      </div>
    );
  }

  if (hasSidebarsOnSide === 'both') {
    return (
      <div className="relative w-full md:left-[220px] md:w-[calc(100%_-_220px)] lg:w-[calc(100%_-_520px)]">
        {children}
      </div>
    );
  }

  return null;
};

type DashboardLayoutFixedSidebarProps = {
  readonly side: 'left' | 'right';
  readonly children: ReactNode;
  readonly className?: string;
};

export const DashboardLayoutFixedSidebar = (
  props: DashboardLayoutFixedSidebarProps,
) => {
  const pathname = usePathname();

  const {width} = useWindowSize();
  const {children, side, className} = props;
  const [offset, setOffset] = useState(0);
  const [offsetCalculated, setOffsetCalculated] = useState(false);

  const maxWidth = 1200;

  // Calculate the space to leave
  useEffect(() => {
    setOffset(width > maxWidth ? (width - maxWidth) / 2 : 0);
    setOffsetCalculated(true);
  }, [width, offset]);

  if (shouldHideNavigation(pathname)) {
    return null;
  }

  // NOTE: sidebar width needs to match and it can't be extracted to variable
  // (since tailwind wont pick it up)
  if (side === 'right') {
    return (
      <div
        className={cn('fixed top-0 hidden w-[210px] lg:block', className)}
        style={{right: offsetCalculated ? offset : -9999}}
      >
        {children}
      </div>
    );
  }

  if (side === 'left') {
    return (
      <div
        className={cn(
          'min-safe-h-screen fixed top-0 z-30 hidden w-[200px] border-r border-[#e5e7eb] bg-white lg:block',
          className,
        )}
        style={{left: offsetCalculated ? offset : -9999}}
      >
        {children}
      </div>
    );
  }

  return null;
};
