'use client';

import {useEffect, useState} from 'react';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {ChevronRight, SearchIcon} from 'lucide-react';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {Loader} from '@/components/atomic/atoms/Loader';
import useAuth from '@/hooks/use-auth';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import {PATHS} from '@/constants.mjs';
import {sp} from '@/lib/utils';

type UserListItem = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarSlug: string;
  color: string;
};

const texts = {
  members: {
    'en-US': 'Members',
    'sv-SE': 'Medlemmar',
    'fi-FI': 'Jäsenet',
  },
  failedToFetchUsers: {
    'en-US': 'Failed to get users',
    'sv-SE': 'Misslyckades med att hämta användare',
    'fi-FI': 'Käyttäjien haku epäonnistui',
  },
  noUsersFound: {
    'en-US': 'No users found',
    'sv-SE': 'Inga användare hittades',
    'fi-FI': 'Käyttäjiä ei löytynyt',
  },
  sendStrengthsToIndividuals: {
    'en-US': 'Send strengths to individuals',
    'sv-SE': 'Skicka styrkor till individer',
    'fi-FI': 'Lähetä vahvuuksia yksittäisille käyttäjille',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const UsersList = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchingData, setFetchingData] = useState(false);
  const {getLoggedInUserId} = useAuth();

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredUsers = () => {
    return users.filter((user) => {
      const firstName = user.firstName?.toLowerCase() || '';
      const lastName = user.lastName?.toLowerCase() || '';
      const trimmedSearchTerm = searchTerm?.toLowerCase().trim() || '';

      return (
        firstName.includes(trimmedSearchTerm) ||
        lastName.includes(trimmedSearchTerm)
      );
    });
  };

  useEffect(() => {
    const run = async () => {
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired({force: true});
      try {
        const usersQuery = (await directus.items('directus_users').readByQuery({
          filter: {
            _and: [
              {
                id: {
                  _neq: getLoggedInUserId(),
                },
              },
              {
                expires_at: {
                  _null: true,
                },
              },
              {
                first_name: {
                  _nnull: true,
                },
              },
              {
                swl_wall: {
                  _nnull: true,
                },
              },
              {
                is_strength_session_user: {
                  _null: true,
                },
              },
            ],
          },
          fields: [
            'id',
            'first_name',
            'last_name',
            'avatar',
            'avatar_slug',
            'color',
          ],
          limit: -1,
        })) as any;
        setUsers(
          (usersQuery.data ?? [])
            .map((user: any) => ({
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              avatar: user.avatar,
              avatarSlug: user.avatar_slug,
              color: user.color,
            }))
            .sort(() => 0.5 - Math.random()),
        );
      } catch {
        toast.error(t('failedToFetchUsers', locale));
      }

      setFetchingData(false);
    };

    run();
  }, []);

  const filteredUsers = getFilteredUsers();

  if (fetchingData) {
    return (
      <div className="flex w-full max-w-2xl flex-col">
        <div className="mt-8 flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xs font-bold uppercase text-gray-800">
        {t('members', locale)}
      </h2>
      <h3 className="my-2 text-xs text-gray-800">
        {t('sendStrengthsToIndividuals', locale)}
      </h3>
      <div className="h-full w-full overflow-y-auto p-2">
        <div className="flex flex-col space-y-2">
          <div className="mb-2 flex items-center rounded-md border border-gray-100 bg-gray-50 p-2">
            <div className="w-[25px] pr-2">
              <SearchIcon size={20} />
            </div>
            <input
              className="w-full border-none bg-gray-50 outline-none"
              onChange={handleSearchChange}
            />
          </div>
          {filteredUsers.length === 0 && <>{t('noUsersFound', locale)}</>}
          {filteredUsers.map((user) => (
            <Link
              key={`${user.id}-item`}
              href={sp(PATHS.user, {userId: user.id})}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="min-w-[30px]">
                    <Avatar
                      size={30}
                      imageSizeMultiplier={0.95}
                      avatarFileId={user.avatar}
                      avatarSlug={user.avatarSlug}
                      color={user.color}
                      name={`${user.firstName ?? ''} ${user.lastName ?? ''}`}
                    />
                  </div>
                  <div title={`${user.firstName ?? ''} ${user.lastName ?? ''}`}>
                    {user.firstName}
                  </div>
                </div>
                <div>
                  <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
