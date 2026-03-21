'use client';

import {useParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import Link from 'next/link';
import {useState} from 'react';
import {PageNavigation} from '@/components/PageNavigation';
import {PATHS} from '@/constants.mjs';
import {sp} from '@/lib/utils';
import {getLocaleCode} from '@/lib/locale';
import {EllipsisIcon} from '@/components/atomic/atoms/EllipsisIcon';
import {ArrowRightIcon} from '@/components/atomic/atoms/ArrowRightIcon';
import {ContextMenu} from '@/components/ContextMenu';
import Avatar from '@/components/atomic/organisms/Avatar';

const texts = {
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
  tools: {
    'en-US': 'Tools',
    'sv-SE': 'Verktyg',
    'fi-FI': 'Työkalut',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly groupData: {
    name: string;
    color: string;
    avatar: string;
  };
};

export const GroupHeader = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {name, color, avatar} = props.groupData;
  const {groupSlug}: {groupSlug: string} = useParams();

  // @TODO disabled for now, but can be enabled once group settings page is
  // available
  const enableContextMenu = false;

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

  return (
    <>
      <ContextMenu
        isShown={showContextMenu}
        position={contextMenuPosition}
        onClose={() => {
          setShowContextMenu(false);
        }}
      >
        <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
          Group settings
        </li>
        <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
          Delete group
        </li>
      </ContextMenu>
      <div className="sticky top-0 z-10 w-full bg-white">
        <div className="h-[54px]">
          <div className="flex justify-between">
            <div className="ml-[20px] mt-[16px]">
              <Link href={PATHS.homeGroups}>
                <ArrowRightIcon />
              </Link>
            </div>
            <div className="mt-[16px] font-bold">{name}</div>
            <div className="relative mr-[20px] mt-[16px]">
              {enableContextMenu ? (
                <EllipsisIcon
                  className="cursor-pointer"
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
            <div className="text-md font-bold">{name}</div>
          </div>
        </div>
      </div>
      <div className="sticky top-[54px] z-10 w-full bg-white lg:hidden">
        <PageNavigation
          items={[
            {
              slug: 'strengths',
              text: t('strengths', locale),
              path: sp(PATHS.groupStrengths, {groupSlug}),
            },
            {
              slug: 'moments',
              text: t('moments', locale),
              path: sp(PATHS.groupMoments, {groupSlug}),
            },
            {
              slug: 'tools',
              text: t('tools', locale),
              path: sp(PATHS.groupTools, {groupSlug}),
            },
          ]}
        />
      </div>
    </>
  );
};
