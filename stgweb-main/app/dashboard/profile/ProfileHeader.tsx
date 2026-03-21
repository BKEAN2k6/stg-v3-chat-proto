'use client';

import Link from 'next/link';
import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import {useDebounce} from 'react-use';
import {fetchProfileData} from './_utils';
import {PageNavigation} from '@/components/PageNavigation';
import {EllipsisIcon} from '@/components/atomic/atoms/EllipsisIcon';
import {PATHS} from '@/constants.mjs';
import useDashboard from '@/hooks/useDashboard';
import Avatar from '@/components/atomic/organisms/Avatar';
import {getLocaleCode} from '@/lib/locale';
import {HeartIcon} from '@/components/atomic/atoms/HeartIcon';
import useGlobal from '@/hooks/useGlobal';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {ContextMenu} from '@/components/ContextMenu';
import {LetterIcon} from '@/components/atomic/atoms/LetterIcon';

const texts = {
  profile: {
    'en-US': 'Profile',
    'sv-SE': 'Profil',
    'fi-FI': 'Profiili',
  },
  settingsText: {
    'en-US': 'Settings',
    'sv-SE': 'Inställningar',
    'fi-FI': 'Asetukset',
  },
  logoutText: {
    'en-US': 'Log out',
    'sv-SE': 'Logga ut',
    'fi-FI': 'Kirjaudu ulos',
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

export const ProfileHeader = () => {
  const {cachedRender} = useGlobal();
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {dashboardState} = useDashboard();
  const firstName = dashboardState.userFirstName ?? '';
  const lastName = dashboardState.userLastName ?? '';
  const name = `${firstName} ${lastName}`;
  const [creditCount, setCreditCount] = useState<any>(
    dashboardState.userCredits,
  );

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

  useDebounce(() => {
    const run = async () => {
      if (cachedRender) {
        const directus = createClientSideDirectusClient();
        try {
          await refreshAuthIfExpired({force: true});
          const updatedProfileData = await fetchProfileData(directus);
          setCreditCount(updatedProfileData.creditCount);
        } catch {}
      }
    };

    run();
  });

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
          <Link
            href={PATHS.accountSettingsProfile}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {t('settingsText', locale)}
          </Link>
        </li>
        <li>
          <Link
            href={PATHS.logout}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {t('logoutText', locale)}
          </Link>
        </li>
      </ContextMenu>
      <div className="sticky top-0 z-10 w-full bg-white">
        <div className="h-[54px]">
          <div className="flex justify-between">
            <div className="ml-[20px] mt-[16px]">
              <Link href={PATHS.inbox}>
                <LetterIcon />
              </Link>
            </div>
            <div className="mt-[16px] font-bold">{t('profile', locale)}</div>
            <div className="mr-[20px] mt-[16px]">
              <EllipsisIcon
                className="cursor-pointer"
                onClick={(event: React.MouseEvent) => {
                  toggleContextMenu(event);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 flex w-full flex-col items-start justify-between rounded-lg p-4 xs:flex-row xs:items-center">
        <div className="flex items-center space-x-2">
          <div className="min-w-[80px]">
            <Avatar
              size={80}
              avatarFileId={dashboardState.userAvatar}
              avatarSlug={dashboardState.userAvatarSlug}
              color={dashboardState.userColor}
              name={`${dashboardState.userFirstName} ${dashboardState.userLastName}`}
              // strengths={topStrengthsArray}
            />
          </div>
          <div className="pl-2">
            <h1 className="pr-2 text-lg font-extrabold">{name}</h1>
          </div>
        </div>
        <div className="mt-6 xs:mt-0">
          <div className="rounded-lg bg-gray-200 p-2 shadow">
            <div className="flex items-center space-x-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-solid border-primary bg-primary-lighter-2 xs:h-7 xs:w-7">
                <HeartIcon className="w-[10px] xs:w-[20px]" />
              </div>
              <div className="mb-[-1px] text-xs xs:text-base">
                {creditCount}
              </div>
            </div>
          </div>
        </div>
      </div>
      {dashboardState.useNov23StructureUpdate && (
        <div className="sticky top-[54px] z-10 w-full bg-white lg:hidden">
          <PageNavigation
            items={[
              {
                slug: 'strengths',
                text: t('strengths', locale),
                path: PATHS.profileStrengths,
              },
              {
                slug: 'moments',
                text: t('moments', locale),
                path: PATHS.profileMoments,
              },
            ]}
          />
        </div>
      )}
    </>
  );
};
