'use client';

import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {usePathname, useRouter} from 'next/navigation';
import {SidebarNavigationCollapsible} from './SidebarNavigationCollapsible';
import {getLocaleCode} from '@/lib/locale';
import {PATHS} from '@/constants.mjs';
import {Loader} from '@/components/atomic/atoms/Loader';
import {refreshAuthIfExpired} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {cn, sp} from '@/lib/utils';
import useDashboard from '@/hooks/useDashboard';
import {BarbellIconFilled} from '@/components/atomic/atoms/BarbellIconFilled';
import NoteIcon from '@/components/atomic/atoms/NoteIcon';
import {HammerIconFilled} from '@/components/atomic/atoms/HammerIconFilled';

const texts = {
  failedToFetchGroups: {
    'en-US': 'Failed to fetch groups',
    'fi-FI': 'Ryhmien haku epäonnistui',
    'sv-SE': 'Misslyckades med att hämta grupper',
  },
  failedToPickGroup: {
    'en-US': 'Failed to pick group',
    'fi-FI': 'Ryhmän valitseminen epäonnistui',
    'sv-SE': 'Misslyckades med att välja grupp',
  },
  noGroups: {
    'en-US': 'No groups',
    'fi-FI': 'Ei ryhmiä',
    'sv-SE': 'Inga grupper',
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
  tools: {
    'en-US': 'Tools',
    'sv-SE': 'Verktyg',
    'fi-FI': 'Työkalut',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type GroupListItem = {
  id: string;
  slug: string;
  name: string;
  strengthWallId: string;
  avatar?: string;
  color?: string;
};

type WrapperProps = {
  readonly children: React.ReactNode;
};

const Spinner = () => {
  return (
    <div className="items-center justify-center">
      <div className="loader h-4 w-4 rounded-full border-4 border-gray-200 ease-linear" />
    </div>
  );
};

const Wrapper = (props: WrapperProps) => {
  const {children} = props;
  return <div className="w-full">{children}</div>;
};

export const SidebarGroupPicker = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isFetching, setIsFetching] = useState(false);
  const [switchingToGroupId, setSwitchingToGroupId] = useState<string | undefined>(); // prettier-ignore
  const [switchingToPath, setSwitchingToPath] = useState<string | undefined>(); // prettier-ignore
  const [failedToFetch, setFailedToFetch] = useState(false);
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const {dashboardState, setDashboardState} = useDashboard();

  const handlePickGroup = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    group: GroupListItem,
    path: string,
  ) => {
    event.preventDefault();
    if (switchingToGroupId) return;

    // go directly to navigation path if we already have this group active
    if (dashboardState.userActiveGroupId === group.id) {
      console.log('group is active');
      router.push(sp(path, {groupSlug: group.slug}));
      return;
    }

    // otherwise first call the custom route to switch the group
    setSwitchingToGroupId(group.id);
    setSwitchingToPath(path);
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch(PATHS.switchGroup, {
        method: 'POST',
        body: JSON.stringify({
          groupId: group.id,
        }),
      });
      if (!call.ok) {
        const body = await call.json();
        throw new Error(body.message || 'unknown');
      }
    } catch {
      setSwitchingToGroupId(undefined);
      toast.error(t('failedToPickGroup', locale), {
        id: 'unknown-error',
      });
    }

    setSwitchingToGroupId(undefined);
    setDashboardState({
      userActiveGroupId: group.id,
      userActiveGroupName: group.name,
      userActiveGroupStrengthWallId: group.strengthWallId,
    });
    router.push(sp(path, {groupSlug: group.slug}));
  };

  useLegacyEffect(() => {
    const run = async () => {
      setIsFetching(true);
      try {
        await refreshAuthIfExpired({force: true});
        const call = await fetch(PATHS.getOwnGroupLinks, {
          method: 'GET',
        });
        if (!call.ok) {
          const body = await call.json();
          throw new Error(body.message || 'unknown');
        }

        const body = await call.json();
        const ownGroupLinks = body.data;

        setGroups(
          ownGroupLinks.map((groupLink: any) => ({
            id: groupLink.group.id,
            slug: groupLink.group.slug,
            name: groupLink.group.name,
            strengthWallId: groupLink.group.swl_wall,
            color: groupLink.group.color,
            avatar: groupLink.group.avatar,
          })),
        );
      } catch {
        setIsFetching(false);
        setFailedToFetch(true);
        return;
      }

      setIsFetching(false);
    };

    run();
  }, []);

  if (isFetching) {
    return (
      <Wrapper>
        <div className="py-2">
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (failedToFetch) {
    return <Wrapper>{t('failedToFetchGroups', locale)}</Wrapper>;
  }

  if (groups.length === 0) {
    return <Wrapper>{t('noGroups', locale)}</Wrapper>;
  }

  return (
    <Wrapper>
      <div className="flex w-full flex-col">
        {groups.map((group) => {
          // const hasAvatar = Boolean(group.avatar);
          // const initials = getInitials(group.name);
          const switchingToThisGroup = switchingToGroupId === group.id;
          const strengthsIsActive =
            pathname === sp(PATHS.groupStrengths, {groupSlug: group.slug});

          const momentsIsActive =
            pathname === sp(PATHS.groupMoments, {groupSlug: group.slug});

          const toolsIsActive =
            pathname === sp(PATHS.groupTools, {groupSlug: group.slug});

          return (
            <SidebarNavigationCollapsible
              key={`group-${group.id}-${dashboardState.userActiveGroupId}`}
              title={group.name}
              isActive={
                group.id === dashboardState.userActiveGroupId &&
                pathname.startsWith(PATHS.group.replace('[groupSlug]', ''))
              }
            >
              <div className="space-y-1 border-l-2 border-[#e5e7eb]">
                <a
                  href="#"
                  className={cn(
                    'ml-2 px-2 py-1 flex w-full border border-white rounded-md hover:bg-gray-100',
                    strengthsIsActive && 'bg-primary-lighter-3 border-primary',
                  )}
                  onClick={async (event) =>
                    handlePickGroup(event, group, PATHS.groupStrengths)
                  }
                >
                  <div className="mr-2 flex items-center justify-center">
                    {switchingToThisGroup &&
                    switchingToPath === PATHS.groupStrengths ? (
                      <Spinner />
                    ) : (
                      <BarbellIconFilled className="w-4" />
                    )}
                  </div>
                  <div>{t('strengths', locale)}</div>
                </a>
                <a
                  href="#"
                  className={cn(
                    'ml-2 px-2 py-1 flex w-full border border-white rounded-md hover:bg-gray-100',
                    momentsIsActive && 'bg-primary-lighter-3 border-primary',
                  )}
                  onClick={async (event) =>
                    handlePickGroup(event, group, PATHS.groupMoments)
                  }
                >
                  <div className="mr-2 flex items-center justify-center">
                    {switchingToThisGroup &&
                    switchingToPath === PATHS.groupMoments ? (
                      <Spinner />
                    ) : (
                      <NoteIcon className="w-4" />
                    )}
                  </div>
                  <div>{t('moments', locale)}</div>
                </a>
                <a
                  href="#"
                  className={cn(
                    'ml-2 px-2 py-1 flex w-full border border-white rounded-md hover:bg-gray-100',
                    toolsIsActive && 'bg-primary-lighter-3 border-primary',
                  )}
                  onClick={async (event) =>
                    handlePickGroup(event, group, PATHS.groupTools)
                  }
                >
                  <div className="mr-2 flex items-center justify-center">
                    {switchingToThisGroup &&
                    switchingToPath === PATHS.groupTools ? (
                      <Spinner />
                    ) : (
                      <HammerIconFilled className="w-4" />
                    )}
                  </div>
                  <div>{t('tools', locale)}</div>
                </a>
              </div>
            </SidebarNavigationCollapsible>
          );
        })}
      </div>
    </Wrapper>
  );
};
