'use client';

import {type ReactNode, useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {X} from 'lucide-react';
import {useCookies} from 'next-client-cookies';
import {useWindowSize} from 'react-use';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import {HamburgerIcon} from '@/components/atomic/atoms/HamburgerIcon';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  settings: {
    'en-US': 'Settings',
    'fi-FI': 'Asetukset',
    'sv-SE': 'Inställningar',
  },
  profile: {
    'en-US': 'Profile',
    'fi-FI': 'Profiili',
    'sv-SE': 'Profil',
  },
  language: {
    'en-US': 'Language',
    'fi-FI': 'Kieli',
    'sv-SE': 'Språk',
  },
  account: {
    'en-US': 'Account',
    'fi-FI': 'Tili',
    'sv-SE': 'Konto',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly children: ReactNode;
};

export const SettingsModal = (props: Props) => {
  const {children} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const {width, height} = useWindowSize();

  const isActive = useCallback(
    (path: string) => pathname.startsWith(path),
    [pathname],
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
      <PageTransitionWrapper>
        <header>
          <div className="flex w-full px-6 pb-4 pt-6">
            <div className="flex-none md:hidden">
              <a onClick={handleNaviToggleClick}>
                <HamburgerIcon />
              </a>
            </div>
            <div className="flex-1">
              <div className="px-4 text-center">
                <h1 className="text-lg font-bold">{t('settings', locale)}</h1>
              </div>
            </div>
            <div className="flex-none">
              <Link href={PATHS.profile}>
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
            {/* @TODO */}
            {/* <div className="mb-6">
              <div className="mb-2 flex items-center">
                <span className="mr-2">👤</span>
                <span className="text-xs font-bold uppercase">
                  Organization
                </span>
              </div>
              <ul className="ml-4 space-y-1">
                <li className="rounded-md px-2 py-1 hover:bg-gray-100">
                  <Link href="/organization/general">General</Link>
                </li>
                <li className="rounded-md px-2 py-1 hover:bg-gray-100">
                  <Link href="/organization/members">Members</Link>
                </li>
              </ul>
            </div> */}

            <div>
              <div className="mb-2 flex items-center">
                <span className="mr-2">👤</span>
                <span className="text-xs font-bold uppercase">
                  {t('account', locale)}
                </span>
              </div>
              <ul className="ml-4 space-y-1">
                <li
                  className={cn(
                    'rounded-md px-2 py-1 hover:bg-gray-100',
                    isActive(PATHS.accountSettingsProfile) && 'bg-gray-100',
                  )}
                >
                  <Link
                    href={PATHS.accountSettingsProfile}
                    onClick={handleNaviLinkClick}
                  >
                    {t('profile', locale)}
                  </Link>
                </li>
                <li
                  className={cn(
                    'rounded-md px-2 py-1 hover:bg-gray-100',
                    isActive(PATHS.accountSettingsLanguage) && 'bg-gray-100',
                  )}
                >
                  <Link
                    href={PATHS.accountSettingsLanguage}
                    onClick={handleNaviLinkClick}
                  >
                    {t('language', locale)}
                  </Link>
                </li>
                {/* @TODO */}
                {/* <li
                  className={cn(
                    "rounded-md px-2 py-1 hover:bg-gray-100",
                    isActive(PATHS.accountSettingsNotifications) &&
                      "bg-gray-100"
                  )}
                >
                  <Link
                    href={PATHS.accountSettingsNotifications}
                    onClick={handleNaviLinkClick}
                  >
                    Notifications
                  </Link>
                </li> */}
              </ul>
            </div>
          </nav>

          <main className={cn(isMobileNavOpen ? 'hidden' : 'block')}>
            {children}
          </main>
        </div>
      </PageTransitionWrapper>
    </div>
  );
};
