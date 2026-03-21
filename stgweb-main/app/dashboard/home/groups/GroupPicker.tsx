'use client';

import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {getLocaleCode} from '@/lib/locale';
import {PATHS} from '@/constants.mjs';
import {Loader} from '@/components/atomic/atoms/Loader';
import {refreshAuthIfExpired} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useDashboard from '@/hooks/useDashboard';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import {sp} from '@/lib/utils';

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
  noGroupsCreated: {
    'en-US': 'No groups',
    'fi-FI': 'Ei ryhmiä',
    'sv-SE': 'Inga grupper',
  },
  createAGroup: {
    'en-US': 'Create a group, document strengths and make progress visible.',
    'fi-FI': 'Luo ryhmä, dokumentoi vahvuuksia ja tee edistymisenne näkyväksi',
    'sv-SE': 'Skapa en grupp, dokumentera styrkor och synliggöra framsteg.',
  },
  yourGroups: {
    'en-US': 'Your groups',
    'fi-FI': 'Ryhmäsi',
    'sv-SE': 'Dina grupper',
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

const Wrapper = (props: WrapperProps) => {
  const {children} = props;
  return <div className="w-full">{children}</div>;
};

export const GroupPicker = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isFetching, setIsFetching] = useState(true);
  const [switchingToGroupId, setSwitchingToGroupId] = useState<
    string | undefined
  >(undefined);
  const [failedToFetch, setFailedToFetch] = useState(false);
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const router = useRouter();
  const {setDashboardState} = useDashboard();

  const handlePickGroup = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    group: GroupListItem,
  ) => {
    if (switchingToGroupId) return;
    event.preventDefault();
    setSwitchingToGroupId(group.id);
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

    setDashboardState({
      userActiveGroupId: group.id,
      userActiveGroupName: group.name,
      userActiveGroupStrengthWallId: group.strengthWallId,
    });
    router.push(sp(PATHS.group, {groupSlug: group.slug}));
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
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (groups.length === 0) {
    return (
      <Wrapper>
        <div className="text-center">
          <h2 className="mb-2 mt-6 text-lg font-bold">
            {t('noGroupsCreated', locale)}
          </h2>
          <p className="mb-2 text-base">{t('createAGroup', locale)}</p>
        </div>
      </Wrapper>
    );
  }

  if (failedToFetch) {
    return <Wrapper>{t('failedToFetchGroups', locale)}</Wrapper>;
  }

  return (
    <Wrapper>
      <div className="flex flex-col">
        <div className="mb-2 text-xs font-bold uppercase">
          {t('yourGroups', locale)}
        </div>
        {groups.map((group) => {
          const switchingToThisGroup = switchingToGroupId === group.id;

          return (
            <a
              key={`group-${group.id}`}
              href="#"
              className="mb-4 flex w-full items-center rounded-lg border-2 border-gray-100 bg-gray-50 p-4"
              onClick={async (event) => handlePickGroup(event, group)}
            >
              <div
                className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border"
                style={{
                  backgroundColor: switchingToThisGroup
                    ? '#fefefe'
                    : group.color ?? '#666',
                }}
              >
                {switchingToThisGroup ? (
                  <div className="items-center justify-center">
                    <div className="loader h-5 w-5 rounded-full border-4 border-gray-200 ease-linear" />
                  </div>
                ) : (
                  <Avatar
                    avatarFileId={group.avatar}
                    color={group.color}
                    name={group.name}
                    placeholderClassName="text-sm"
                  />
                )}
              </div>
              <div className="text-md font-bold">{group.name}</div>
            </a>
          );
        })}
      </div>
    </Wrapper>
  );
};
