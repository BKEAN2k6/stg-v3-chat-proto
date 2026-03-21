'use client';

import Link from 'next/link';
import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
import {PageNavigation} from '@/components/PageNavigation';
import {EllipsisIcon} from '@/components/atomic/atoms/EllipsisIcon';
import {PATHS} from '@/constants.mjs';
import useDashboard from '@/hooks/useDashboard';
import {getLocaleCode} from '@/lib/locale';
import {ContextMenu} from '@/components/ContextMenu';
import Avatar from '@/components/atomic/organisms/Avatar';

const texts = {
  changeOrganization: {
    'en-US': 'Change organization',
    'sv-SE': 'Byt organisation',
    'fi-FI': 'Vaihda organisaatiota',
  },
  members: {
    'en-US': 'Members',
    'sv-SE': 'Medlemmar',
    'fi-FI': 'Jäsenet',
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

export const HomeHeader = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {dashboardState} = useDashboard();
  const name = dashboardState.userActiveOrganizationName ?? '';
  const color = dashboardState.userActiveOrganizationColor;
  const avatar = dashboardState.userActiveOrganizationAvatar;
  const orgCount = dashboardState.userOrganizationCount ?? 1;
  const pathname = usePathname();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    right: 0,
  });

  const toggleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setContextMenuPosition({
      top: event.clientY,
      right: window.innerWidth - event.clientX,
    });
    setShowContextMenu((previous) => !previous);
  };

  if (pathname === PATHS.homeTools) {
    return null;
  }

  return (
    <>
      <ContextMenu
        isShown={showContextMenu}
        position={contextMenuPosition}
        onClose={() => {
          setShowContextMenu(false);
        }}
      >
        <li>
          {/* NOTE: having context menu for this is not the final solution, but
          the new UI for org switching was scoped out and this was the fastest
          way to pull this off */}
          <Link
            href={PATHS.organizationPicker}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {t('changeOrganization', locale)}
          </Link>
        </li>
      </ContextMenu>
      <div className="sticky top-0 z-10 w-full bg-white">
        <div className="h-[54px]">
          <div className="flex justify-between">
            <div className="ml-[20px] mt-[16px]">&nbsp;</div>
            <div className="mt-[16px] font-bold">{name}</div>
            <div className="mr-[20px] mt-[16px]">
              {/* NOTE: for as long as there's only one link here, we hide the
              context menu trigger if user has only one org */}
              {orgCount > 1 ? (
                <EllipsisIcon
                  onClick={(event: React.MouseEvent) => {
                    toggleContextMenu(event);
                  }}
                />
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="mb-4 flex w-full items-center justify-between p-4">
          <div className="flex items-center">
            <div className="mr-4">
              <Avatar
                size={80}
                avatarFileId={avatar}
                color={color}
                name={name}
              />
            </div>
            <div className="flex flex-col">
              <div className="text-md font-bold">{name}</div>
            </div>
          </div>
        </div>
      </div>
      {pathname !== PATHS.homeGroups && (
        <div className="sticky top-[54px] z-10 w-full bg-white lg:hidden">
          <PageNavigation
            items={[
              {
                slug: 'moments',
                text: t('moments', locale),
                path: PATHS.homeMoments,
              },
              {
                slug: 'members',
                text: t('members', locale),
                path: PATHS.homeMembers,
              },
            ]}
          />
        </div>
      )}
    </>
  );
};
