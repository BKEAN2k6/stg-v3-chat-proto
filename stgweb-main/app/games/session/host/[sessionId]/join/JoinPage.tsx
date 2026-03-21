'use client';

import {type RefObject, useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Edit} from 'lucide-react';
import {useCookies} from 'next-client-cookies';
import {renderToString} from 'react-dom/server';
import {toast} from 'react-hot-toast';
import {
  fetchStrengthSession,
  fetchStrengthSessionUsers,
  sp,
  wsevent,
} from '../../../_utils';
import {
  BouncingItemsBackground,
  type BouncingItemsBackgroundInstance,
} from '../BouncingItemsBackground';
import {UserListDialog} from './UserListDialog';
import {IS_DEVELOPMENT_OR_STAGING, PATHS, SHORT_DOMAIN} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useWebSocket from '@/hooks/useWebSocket';
import ClientOnly from '@/components/ClientOnly';
import {QRCodeImage} from '@/components/QRCodeImage';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {getUrlWithScheme} from '@/lib/utils';

const DEBUG = process.env.NODE_ENV === 'development';

const texts = {
  editParticipants: {
    'en-US': 'Edit participants',
    'sv-SE': 'Redigera deltagare',
    'fi-FI': 'Muokkaa osallistujia',
  },
  failedToRemoveUser: {
    'en-US': 'Failed to remove user',
    'sv-SE': 'Det gick inte att ta bort användaren',
    'fi-FI': 'Käyttäjän poistaminen epäonnistui',
  },
  failedToCreateRooms: {
    'en-US': 'Failed to create rooms',
    'sv-SE': 'Det gick inte att skapa rum',
    'fi-FI': 'Huoneiden luominen epäonnistui',
  },
  joinSession: {
    'en-US': 'Join strength sprint',
    'fi-FI': 'Liity vahvuustuokioon',
    'sv-SE': 'Delta i styrkesprint',
  },
  startSession: {
    'en-US': 'Start sprint',
    'fi-FI': 'Aloita tuokio',
    'sv-SE': 'Starta sprint',
  },
  participants: {
    'en-US': 'Participants',
    'fi-FI': 'Osallistujaa',
    'sv-SE': 'Deltagare',
  },
  notEnoughParticipants: {
    'en-US': 'At least 2 participants needed to start',
    'fi-FI': 'Vähintään 2 osallistujaa tarvitaan',
    'sv-SE': 'Minst 2 deltagare behövs för att starta',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

// NOTE: this is like a server component, no interactivity allowed!
const BouncingObject = (props: {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}) => {
  const {id, name, color} = props;
  return (
    <div
      id={id}
      className="flex h-full w-full flex-col items-center justify-center"
    >
      <div className="rounded-full" style={{backgroundColor: color}}>
        <div className="px-4 py-2 text-center text-lg font-bold">{name}</div>
      </div>
    </div>
  );
};

type DatabaseUser = {
  id: string;
  first_name?: string;
  color?: string;
};

type Props = {
  readonly sessionId: string;
  readonly sessionUsers: any[];
};

// NOTE: this is a bit of an antipattern to declare a global variable, but
// should be fine in this case, since this is a single use component defining a
// page (so not used in multiple places ever)
let pollUsersInterval: any = null;

export const JoinPage = (props: Props) => {
  const {sessionId, sessionUsers} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const searchParameters = useSearchParams();
  const joinShortCode = searchParameters.get('code');
  const [startingSession, setStartingSession] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [usersSeen, setUsersSeen] = useState<DatabaseUser[]>([]);

  // we need access to the correct value of this this from an interval and an
  // event listener, so that's why the more complicated setter
  const usersSeenRef = useRef(usersSeen);
  const setUsersSeenRef = (newValues: DatabaseUser[], add: boolean) => {
    let values = newValues;
    if (add) {
      values = [...usersSeenRef.current, ...values];
    }

    usersSeenRef.current = values;
    setUsersSeen(values);
  };

  const router = useRouter();
  const p5Ref = useRef<BouncingItemsBackgroundInstance | undefined>(null);

  const qrDisplayDomain = SHORT_DOMAIN;
  const qrCodeDomain = getUrlWithScheme(SHORT_DOMAIN);

  const handleAddObject = (name: string, userId: string, color: string) => {
    const id = `${userId}-bouncer`;
    const p5Instance = p5Ref?.current?.getP5Instance();
    if (p5Instance) {
      const reactElement = <BouncingObject id={id} name={name} color={color} />;
      const div = p5Instance.createDiv(renderToString(reactElement));
      div.id(id);
      div.size(80, 50);
      p5Ref?.current?.createNewObject(div);
    }
  };

  const handleRemoveObject = (id: string) => {
    p5Ref?.current?.removeObject(`${id}-bouncer`);
  };

  const createRooms = (
    users: DatabaseUser[],
    simulateWithUserCount?: number,
    minimumRoomSize = 10,
  ) => {
    let shuffledUsers = users.sort(() => Math.random() - 0.5);

    if (simulateWithUserCount) {
      shuffledUsers = Array.from({length: simulateWithUserCount}, (_, i) => ({
        id: `${i + 1}`,
      })).sort(() => Math.random() - 0.5);
    }

    const totalUsers = shuffledUsers.length;

    if (totalUsers < 2) {
      throw new Error('Minimum user count to start is 2');
    }

    const numberRooms =
      totalUsers < minimumRoomSize
        ? 1
        : Math.ceil(totalUsers / minimumRoomSize);

    const usersPerRoom = Math.floor(totalUsers / numberRooms);
    const roomsWithExtraUser = totalUsers % numberRooms;

    const rooms = [];

    for (let i = 0; i < numberRooms; i++) {
      const roomSize = i < roomsWithExtraUser ? usersPerRoom + 1 : usersPerRoom;
      const room = [];

      for (let j = 0; j < roomSize; j++) {
        const user = shuffledUsers.shift();
        if (user) {
          room.push(user.id);
        }
      }

      rooms.push(room);
    }

    return rooms;
  };

  // Simulating the room creation for different user counts. Outputs the created
  // rooms user counts side by side.
  /*  const roomSimulator = () => {
    // create an array of [2, ..., 202]
    const userCounts = Array.from({length: 200}, (_, i) => i + 2);
    for (const count of userCounts) {
      const rooms = createRooms([], count);
      let lengths = '';
      for (const room of rooms) {
        lengths += `${room.length} `;
      }

      setTimeout(console.log.bind(console, lengths));
    }
  }; */

  const handleCheckForNewUsers = async () => {
    try {
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired({force: true});
      const sessionUsers = await fetchStrengthSessionUsers(sessionId, directus);
      for (const sessionUser of sessionUsers) {
        if (
          sessionUser.id &&
          !usersSeenRef.current.some((seen) => seen.id === sessionUser.id)
        ) {
          handleUserSeen(sessionUser);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserFetch = async (uid: string) => {
    try {
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired({force: true});
      const user = (await directus.items('directus_users').readOne(uid)) as any;
      if (user && !usersSeenRef.current.some((seen) => seen.id === user.id)) {
        handleUserSeen(user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserSeen = (user: DatabaseUser) => {
    if (user.first_name) {
      handleAddObject(user.first_name, user.id, user.color ?? '#ccc');
      setUsersSeenRef([user], true);
    }
  };

  const handleInitialUsersSetup = () => {
    for (const sessionUser of sessionUsers) {
      handleUserSeen(sessionUser);
    }
  };

  const handleAddPlayer = async () => {
    if (IS_DEVELOPMENT_OR_STAGING) {
      await refreshAuthIfExpired();
      await fetch(PATHS.strengthSessionDevAddPlayer, {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
        }),
      });
    }
  };

  const handleRemovePlayer = async (user: DatabaseUser) => {
    let newUsers = usersSeen.map((object) =>
      object.id === user.id ? {...object, isLoading: true} : object,
    );
    setUsersSeenRef(newUsers, false);

    try {
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired({force: true});
      await directus.items('directus_users').deleteOne(user.id);
      newUsers = usersSeen.filter((seen) => seen.id !== user.id);
      setUsersSeenRef(newUsers, false);
      handleRemoveObject(user.id);
    } catch {
      const newUsers = usersSeen.map((object) =>
        object.id === user.id ? {...object, isLoading: false} : object,
      );
      setUsersSeenRef(newUsers, false);
      toast.error(t('failedToRemoveUser', locale));
    }

    if (newUsers.length === 0) {
      setShowUserListModal(false);
    }
  };

  const handleActivate = async () => {
    setStartingSession(true);
    await refreshAuthIfExpired({force: true});

    const directus = createClientSideDirectusClient();
    try {
      const users = await fetchStrengthSessionUsers(sessionId, directus);
      const strengthSession = await fetchStrengthSession(sessionId, directus);
      // Creates rooms based on user count. The minumum room count is 2, and the
      // maximum players per room is 10. Divides users in rooms equally around
      // these two rules.
      let rooms = null;
      if (strengthSession.mode !== 'group_strengths_only') {
        rooms = createRooms(users);
      }

      await directus.items('strength_session').updateOne(sessionId, {
        status: 'active',
        ...(rooms && {rooms}),
      });
    } catch {
      toast.error(t('failedToCreateRooms', locale));
      setStartingSession(false);
      return;
    }

    // notify players of activation
    wsevent({
      sessionId,
      eventType: 'session_activated',
    });
    router.push(sp(PATHS.strengthSessionActiveView, sessionId));
  };

  useWebSocket({
    uid: `join-events-for-strength-session-${sessionId}`,
    // collection: "websocket_event",
    // collection: "simple",
    collection: 'strength_session_new_player',
    query: {
      filter: {
        strength_session: {
          _eq: sessionId,
        },
      },
      limit: -1,
      sort: ['-date_created'],
    },
    events: {
      async create(message) {
        handleUserFetch(message.data?.[0].user);
        // we have received a websocket event, so we can stop the polling
        clearInterval(pollUsersInterval);
      },
    },
  });

  useLegacyEffect(() => {
    // poll for new users (just in case websockets are not working, this
    // gets cleared if we receive a websocket event)
    pollUsersInterval = setInterval(async () => {
      if (DEBUG) console.log('JoinPage: poll for new users...'); // eslint-ignore

      handleCheckForNewUsers();
    }, 3000);
    return () => {
      clearInterval(pollUsersInterval);
    };
  }, []);

  if (!joinShortCode) {
    return <>Error</>;
  }

  return (
    <div className="relative">
      <UserListDialog
        isOpen={showUserListModal}
        close={() => {
          setShowUserListModal(false);
        }}
        users={usersSeenRef.current}
        removeUser={handleRemovePlayer}
        locale={locale}
      />

      <ClientOnly>
        <BouncingItemsBackground
          ref={p5Ref as RefObject<BouncingItemsBackgroundInstance>}
          showCenterArea
          onAfterP5Setup={handleInitialUsersSetup}
        />
      </ClientOnly>
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-white">
            {t('joinSession', locale)}
          </h2>
          <div className="mb-4 text-center font-bold uppercase">
            <span className="rounded-lg bg-primary-darker-1 px-4 py-2 text-white">
              {t('participants', locale)}
            </span>
          </div>
          <div
            key={`users-${usersSeen.length}`}
            className="flex justify-center"
            onClick={handleAddPlayer}
          >
            {usersSeen.length
              .toString()
              .padStart(3, '0')
              .split('')
              .map((number_) => (
                <div
                  key={Math.random()}
                  className="mx-2 w-16 rounded-md border border-gray-200 bg-gray-100 px-3 text-lg"
                >
                  <span className="-mb-2 block text-center text-4xl font-bold text-primary">
                    {number_}
                  </span>
                </div>
              ))}
          </div>

          <a
            href="#"
            className="text-white underline"
            onClick={(event) => {
              event.preventDefault();
              setShowUserListModal(true);
            }}
          >
            <span className="flex justify-center">
              <Edit size={20} className="mr-1" />
              {t('editParticipants', locale)}
            </span>
          </a>

          <div className="w-[400px] rounded-md bg-white py-4 text-center">
            <QRCodeImage
              qrDisplayDomain={qrDisplayDomain}
              qrCodeDomain={qrCodeDomain}
              joinShortCode={joinShortCode}
              locale={locale}
            />
          </div>
          <div className="pt-8 text-center">
            <ButtonWithLoader
              isDisabled={usersSeen.length < 2}
              isLoading={startingSession}
              className="bg-white text-primary disabled:bg-gray-300 disabled:text-gray-400"
              onClick={handleActivate}
            >
              {t('startSession', locale)}
            </ButtonWithLoader>
          </div>
          <div className="h-6 text-center" onClick={handleAddPlayer}>
            {usersSeen.length < 2 && (
              <p className="mt-2 text-xs text-gray-400">
                {t('notEnoughParticipants', locale)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
