'use client';

import {useCallback} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {SidebarGroupPicker} from './SidebarGroupPicker';
import {SidebarNavigationCollapsible} from './SidebarNavigationCollapsible';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import useDashboard from '@/hooks/useDashboard';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import ClientOnly from '@/components/ClientOnly';
import {HomeIconFilled} from '@/components/atomic/atoms/HomeIconFilled';
import {GridIconFilled} from '@/components/atomic/atoms/GridIconFilled';
import {HammerIconFilled} from '@/components/atomic/atoms/HammerIconFilled';
import NoteIcon from '@/components/atomic/atoms/NoteIcon';
import {LetterIcon} from '@/components/atomic/atoms/LetterIcon';
import {BarbellIconFilled} from '@/components/atomic/atoms/BarbellIconFilled';

const texts = {
  home: {
    'en-US': 'Home',
    'sv-SE': 'Hem',
    'fi-FI': 'Koti',
  },
  groups: {
    'en-US': 'Groups',
    'sv-SE': 'Grupper',
    'fi-FI': 'Ryhmät',
  },
  tools: {
    'en-US': 'Tools',
    'sv-SE': 'Verktyg',
    'fi-FI': 'Työkalut',
  },
  inbox: {
    'en-US': 'Inbox',
    'sv-SE': 'Inkorg',
    'fi-FI': 'Viestit',
  },
  profile: {
    'en-US': 'Profile',
    'sv-SE': 'Profil',
    'fi-FI': 'Profiili',
  },
  strengths: {
    'en-US': 'Strengths',
    'sv-SE': 'Styrkor',
    'fi-FI': 'Vahvuudet',
  },
  moments: {
    'en-US': 'Moments',
    'sv-SE': 'Ögonblick',
    'fi-FI': 'Hetket',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const SidebarNavigationNew = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {dashboardState} = useDashboard();
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => pathname.startsWith(path),
    [pathname],
  );

  const homeItems = [
    {
      id: 'home',
      path: PATHS.homeMoments,
      text: t('home', locale),
      icon: () => <HomeIconFilled className="w-full" />,
    },
    {
      id: 'groups',
      path: PATHS.homeGroups,
      text: t('groups', locale),
      icon: () => <GridIconFilled className="w-full" />,
    },
    {
      id: 'tools',
      path: PATHS.homeTools,
      text: t('tools', locale),
      icon: () => <HammerIconFilled className="w-full" />,
    },
  ];

  return (
    <>
      <div className="mb-6 w-full">
        {homeItems.map((item: any) => (
          <Link
            key={item.id}
            href={item.path}
            className={cn(
              'mb-4 flex w-full items-center space-x-2 rounded-lg px-3 py-3 text-2sm text-gray-600 hover:bg-secondary-200 border border-white',
              isActive(item.path) &&
                'text-primary bg-primary-lighter-3 border-primary',
            )}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="h-4 w-4">{item.icon()}</div>
              <span className="mt-0.5">{item.text}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mb-12 w-full">
        <div className="mb-4 text-xs font-bold uppercase text-[#282C34]">
          {t('groups', locale)}
        </div>
        <ClientOnly>
          <SidebarGroupPicker />
        </ClientOnly>
      </div>

      <div className="mb-6 w-full">
        <div className="mb-4 text-xs font-bold uppercase text-[#282C34]">
          {t('profile', locale)}
        </div>
        <ClientOnly>
          <SidebarNavigationCollapsible
            title={t('profile', locale)}
            icon={
              <Avatar
                size={24}
                {...(isActive(PATHS.profile) && {
                  singleColor: 'hsl(258, 52%, 64%)',
                })}
                imageSizeMultiplier={0.85}
                avatarFileId={dashboardState.userAvatar}
                avatarSlug={dashboardState.userAvatarSlug}
                color={dashboardState.userColor}
                strengths={dashboardState.userTopStrengths}
                name={`${dashboardState.userFirstName} ${dashboardState.userLastName}`}
              />
            }
          >
            <div className="space-y-1 border-l-2 border-[#e5e7eb]">
              <Link
                href={PATHS.profileStrengths}
                className={cn(
                  'ml-2 px-2 py-1 flex w-full border border-white rounded-md hover:bg-gray-100',
                  isActive(PATHS.profileStrengths) &&
                    'bg-primary-lighter-3 border-primary',
                )}
              >
                <div className="mr-2 flex items-center justify-center">
                  <BarbellIconFilled className="w-4" />
                </div>
                <div>{t('strengths', locale)}</div>
              </Link>
              <Link
                href={PATHS.profileMoments}
                className={cn(
                  'ml-2 px-2 py-1 flex w-full border border-white rounded-md hover:bg-gray-100',
                  isActive(PATHS.profileMoments) &&
                    'bg-primary-lighter-3 border-primary',
                )}
              >
                <div className="mr-2 flex items-center justify-center">
                  <NoteIcon className="w-4" />
                </div>
                <div>{t('moments', locale)}</div>
              </Link>
              <Link
                href={PATHS.inbox}
                className={cn(
                  'ml-2 px-2 py-1 flex w-full border border-white rounded-md hover:bg-gray-100',
                  isActive(PATHS.inbox) &&
                    'bg-primary-lighter-3 border-primary',
                )}
              >
                <div className="mr-2 flex items-center justify-center">
                  <LetterIcon className="w-4" />
                </div>
                <div>{t('inbox', locale)}</div>
              </Link>
            </div>
          </SidebarNavigationCollapsible>
        </ClientOnly>
      </div>
    </>
  );
};
