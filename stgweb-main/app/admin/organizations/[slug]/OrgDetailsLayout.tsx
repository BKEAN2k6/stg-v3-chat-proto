'use client';

import {type ReactNode, useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {X} from 'lucide-react';
import {useWindowSize} from 'react-use';
import {ADMIN_PATHS} from '../../admin-paths';
import {cn, sp} from '@/lib/utils';
import {HamburgerIcon} from '@/components/atomic/atoms/HamburgerIcon';

type Props = {
  readonly children: ReactNode;
  readonly orgName: string;
};

export const OrgDetailsLayout = (props: Props) => {
  const {children, orgName} = props;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const parameters = useParams();
  const slug = parameters?.slug as string;

  const {width, height} = useWindowSize();

  const isActive = useCallback(
    (path: string) => pathname === sp(path, {slug}),
    [pathname, slug],
  );

  const handleNaviToggleClick = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleNaviLinkClick = () => {
    setIsMobileNavOpen(false);
  };

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [width, height]);

  return (
    <div className="min-safe-h-screen">
      <header>
        <div className="flex w-full px-6 pb-4 pt-6">
          <div className="flex-none md:hidden">
            <a onClick={handleNaviToggleClick}>
              <HamburgerIcon />
            </a>
          </div>
          <div className="flex-1">
            <div className="px-4 text-center">
              <h1 className="text-lg font-bold">{orgName}</h1>
            </div>
          </div>
          <div className="flex-none">
            <Link href={ADMIN_PATHS.listOrganizations}>
              <X className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav
          className={cn(
            'h-full p-4',
            isMobileNavOpen ? 'block' : 'hidden md:block',
          )}
          style={{width: isMobileNavOpen ? '100%' : '200px'}}
        >
          <div>
            <div className="mb-2 flex items-center">
              <span className="mr-2">🏢</span>
              <span className="text-xs font-bold uppercase">General</span>
            </div>
            <ul className="ml-4 space-y-1">
              <li
                className={cn(
                  'rounded-md px-2 py-1 hover:bg-gray-100',
                  isActive(ADMIN_PATHS.organizationUsers) && 'bg-gray-100',
                )}
              >
                <Link
                  href={sp(ADMIN_PATHS.organizationUsers, {slug})}
                  onClick={handleNaviLinkClick}
                >
                  Users
                </Link>
              </li>
              <li
                className={cn(
                  'rounded-md px-2 py-1 hover:bg-gray-100',
                  isActive(ADMIN_PATHS.organizationStatistics) && 'bg-gray-100',
                )}
              >
                <Link
                  href={sp(ADMIN_PATHS.organizationStatistics, {slug})}
                  onClick={handleNaviLinkClick}
                >
                  Statistics
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className={cn(isMobileNavOpen ? 'hidden' : 'block w-full')}>
          {children}
        </main>
      </div>
    </div>
  );
};
