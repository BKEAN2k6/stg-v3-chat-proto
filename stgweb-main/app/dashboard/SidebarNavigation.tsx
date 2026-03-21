'use client';

import {useCallback} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import useDashboard from '@/hooks/useDashboard';
import {BookIcon} from '@/components/atomic/atoms/BookIcon';
import {CommunityIcon} from '@/components/atomic/atoms/CommunityIcon';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import {LetterIcon} from '@/components/atomic/atoms/LetterIcon';

const texts = {
  community: {
    'en-US': 'Community',
    'sv-SE': 'Gemenskap',
    'fi-FI': 'Yhteisö',
  },
  library: {
    'en-US': 'Library',
    'sv-SE': 'Bibliotek',
    'fi-FI': 'Kirjasto',
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
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const SidebarNavigation = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {dashboardState} = useDashboard();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const items = [
    {
      id: 'community',
      path: PATHS.community,
      text: t('community', locale),
      icon: () => <CommunityIcon />,
    },
    {
      id: 'library',
      path: PATHS.library,
      text: t('library', locale),
      icon: () => <BookIcon />,
    },
    {
      id: 'inbox',
      path: PATHS.inbox,
      text: t('inbox', locale),
      icon: () => <LetterIcon />,
    },
    {
      id: 'profile',
      path: PATHS.profileStrengths,
      text: t('profile', locale),
      icon: () => (
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
      ),
    },
  ];

  return (
    <>
      {items.map((item: any) => (
        <Link
          key={item.id}
          href={item.path}
          className={cn(
            'mb-4 flex w-full items-center space-x-2 rounded-lg p-2 text-2sm text-gray-600 hover:bg-secondary-200',
            isActive(item.path) && 'text-primary',
          )}
        >
          {item.icon()}
          <span>{item.text}</span>
        </Link>
      ))}
    </>
  );
};
