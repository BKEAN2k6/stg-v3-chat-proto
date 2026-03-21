'use client';

import {type RefObject, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {renderToString} from 'react-dom/server';
import toast from 'react-hot-toast';
import {fetchStrengthSessionStrengths, sp, wsevent} from '../../../_utils';
import {
  BouncingItemsBackground,
  type BouncingItemsBackgroundInstance,
} from '../BouncingItemsBackground';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {type LocaleCode, getLocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  type StrengthSlug,
  StrengthSlugMap,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useWebSocket from '@/hooks/useWebSocket';
import ClientOnly from '@/components/ClientOnly';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';
import {Varis} from '@/components/atomic/atoms/Varis';

const DEBUG = process.env.NODE_ENV === 'development';

const texts = {
  failedToEnd: {
    'en-US': 'Failed to end sprint',
    'fi-FI': 'Session päättäminen epäonnistui',
    'sv-SE': 'Lyckades inte avsluta sprinten',
  },
  timeToSendStrengths: {
    'en-US': 'Time to send strengths!',
    'fi-FI': 'Aika lähettää vahvuuksia!',
    'sv-SE': 'Dags att skicka styrkor!',
  },
  strengthsSent: {
    'en-US': 'Strengths sent',
    'fi-FI': 'Vahvuuksia lähetetty',
    'sv-SE': 'Styrkor skickade',
  },
  xOfYHaveCompleted: {
    'en-US': '[x] of [y] have completed',
    'fi-FI': '[x] / [y] on valmiina',
    'sv-SE': '[x] av [y] har slutförts',
  },
  endSession: {
    'en-US': 'End sprint',
    'fi-FI': 'Lopeta tuokio',
    'sv-SE': 'Avsluta sprinten',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

// NOTE: treat this like a server component, no interactivity allowed!
const BouncingObject = (props: {
  readonly id: string;
  readonly locale: LocaleCode;
  readonly slug: StrengthSlug;
}) => {
  const {id, locale, slug} = props;
  const color = StrengthColorMap[slug][300];
  const name = StrengthTranslationMap[slug][locale];
  return (
    <div
      id={id}
      className="flex h-full w-full flex-col items-center justify-center"
    >
      <div className="rounded-full" style={{backgroundColor: color}}>
        <Image alt={slug} src={strengthImageBySlug(slug)} />
      </div>
      <div className="mt-4 text-center text-lg font-bold">{name}</div>
    </div>
  );
};

// NOTE: this is a bit of an antipattern to declare a global variable, but
// should be fine in this case, since this is a single use component defining a
// page (so not used in multiple places ever)
let pollStrengthsInterval: any = null;
let pollCompletionInterval: any = null;

type DatabaseSessionStrength = {
  id: string;
  // NOTE: this is a reference to the id one of the 26 strengths in our
  // database, and will most likely get converted to a slug using
  // StrengthSlugMap
  strength: string;
};

type Props = {
  readonly sessionId: string;
  readonly sessionStrengths: any[];
};

export const ViewPage = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {sessionId, sessionStrengths} = props;
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    playersJoined: 0,
    playersStarted: 0,
    playersCompleted: 0,
  });

  const [sessionStrengthsSeen, setSessionStrengthsSeen] = useState<string[]>(
    [],
  );

  // we need access to the correct value of this this from an interval and an
  // event listener, so that's why the more complicated setter
  const sessionStrengthsSeenRef = useRef(sessionStrengthsSeen);
  const setSessionStrengthsSeenRef = (newValues: string[], add: boolean) => {
    let values = newValues;
    if (add) {
      values = [...sessionStrengthsSeenRef.current, ...values];
    }

    sessionStrengthsSeenRef.current = values;
    setSessionStrengthsSeen(values);
  };

  const router = useRouter();
  const p5Ref = useRef<BouncingItemsBackgroundInstance | undefined>(null);

  const handleAddObject = (strengthSlug: StrengthSlug) => {
    const p5Instance = p5Ref?.current?.getP5Instance();
    const objects = p5Ref?.current?.getObjects();
    const id = `${strengthSlug}-bouncer`;
    const existingObject = objects?.find((o) => o.id === id);
    if (!existingObject && p5Instance) {
      const reactElement = (
        <BouncingObject id={id} locale={locale} slug={strengthSlug} />
      );
      const div = p5Instance.createDiv(renderToString(reactElement));
      div.id(id);
      div.size(80, 150);
      p5Ref?.current?.createNewObject(div);
    } else {
      p5Ref?.current?.resizeObjectById(`${strengthSlug}-bouncer`);
    }
  };

  const handleStrengthSeen = (sessionStrength: DatabaseSessionStrength) => {
    const strengthSlug = StrengthSlugMap[sessionStrength.strength];
    if (strengthSlug) {
      handleAddObject(strengthSlug);
      setSessionStrengthsSeenRef([sessionStrength.id], true);
    }
  };

  const handleInitialStrengthsSetup = () => {
    for (const sessionStrength of sessionStrengths) {
      handleStrengthSeen(sessionStrength);
    }
  };

  const handleSessionComplete = async () => {
    if (pollCompletionInterval) {
      clearInterval(pollCompletionInterval);
    }

    setIsLoadingComplete(true);

    await refreshAuthIfExpired({force: true});
    const directus = createClientSideDirectusClient();
    try {
      await directus.items('strength_session').updateOne(sessionId, {
        status: 'completed',
      });
    } catch (error) {
      console.error(error);
      toast.error(t('failedToEnd', locale));
      setIsLoadingComplete(false);
      return;
    }

    // notify players of completion
    wsevent({
      sessionId,
      eventType: 'session_completed',
    });
    router.push(sp(PATHS.strengthSessionCompleteTransition, sessionId));
  };

  const handleCheckCompletion = async () => {
    try {
      await refreshAuthIfExpired();
      const call = await fetch(
        sp(PATHS.strengthSessionCompleteCheck, sessionId),
        {
          method: 'POST',
          body: JSON.stringify({
            sessionId,
          }),
        },
      );
      if (call.ok) {
        const body = await call.json();
        setPlayerStats((previousState) => ({
          ...previousState,
          playersJoined: body.playersJoined,
          playersStarted: body.playersStarted,
          playersCompleted: body.playersCompleted,
        }));
      } else {
        throw new Error('invalid response');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckStrengths = async () => {
    let sessionStrengths: DatabaseSessionStrength[] = [];
    try {
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired({force: true});
      sessionStrengths = await fetchStrengthSessionStrengths(
        sessionId,
        directus,
      );
    } catch (error) {
      console.error(error);
    }

    for (const sessionStrength of sessionStrengths) {
      if (
        sessionStrength.id &&
        !sessionStrengthsSeenRef.current.includes(sessionStrength.id)
      ) {
        handleStrengthSeen(sessionStrength);
      }
    }
  };

  const handleStrengthFetch = async (sessionStrengthId: string) => {
    let sessionStrength: DatabaseSessionStrength | undefined;
    try {
      const directus = createClientSideDirectusClient();
      await refreshAuthIfExpired({force: true});
      sessionStrength = (await directus
        .items('strength_session_strength')
        .readOne(sessionStrengthId)) as any;
    } catch (error) {
      console.error(error);
    }

    if (sessionStrength) {
      handleStrengthSeen(sessionStrength);
    }
  };

  useWebSocket({
    uid: `new-strengths-${sessionId}`,
    collection: 'strength_session_new_strength',
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
        handleStrengthFetch(message.data?.[0].strength_session_strength);
        // we have received a websocket event, so we can stop the polling
        clearInterval(pollStrengthsInterval);
      },
    },
  });

  useLegacyEffect(() => {
    pollCompletionInterval = setInterval(handleCheckCompletion, 5000);
    // poll for new strengths seen (just in case websockets are not working,
    // this gets cleared if we receive a websocket event)
    pollStrengthsInterval = setInterval(() => {
      if (DEBUG) console.log('JoinPage: poll for new strengths...'); // eslint-ignore

      handleCheckStrengths();
    }, 3000);
    return () => {
      clearInterval(pollCompletionInterval);
      clearInterval(pollStrengthsInterval);
    };
  }, []);

  useEffect(() => {
    const joined = playerStats.playersJoined;
    const completed = playerStats.playersCompleted;
    if (joined > 0 && completed > 0 && completed === joined) {
      handleSessionComplete();
    }
  }, [playerStats]);

  return (
    <div className="relative">
      <ClientOnly>
        <BouncingItemsBackground
          ref={p5Ref as RefObject<BouncingItemsBackgroundInstance>}
          showCenterArea={false}
          onAfterP5Setup={handleInitialStrengthsSetup}
        />
      </ClientOnly>
      <div className="absolute left-1/2 top-1/2 z-20 h-80 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-full flex-col justify-center">
          <div className="mb-4 text-center font-bold uppercase">
            <span className="rounded-lg bg-white px-4 py-2">
              {t('strengthsSent', locale)}
            </span>
          </div>
          <div
            key={`seen-${sessionStrengthsSeen.length}`}
            className="flex justify-center"
          >
            {sessionStrengthsSeen.length
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
          <div className="mt-2 flex min-h-[30px] justify-center">
            {playerStats.playersJoined > 0 && (
              <div className="rounded-lg bg-white px-4 py-2">
                {t('xOfYHaveCompleted', locale)
                  .replace('[x]', playerStats.playersCompleted)
                  .replace('[y]', playerStats.playersJoined)}
              </div>
            )}
          </div>
          <div>
            {sessionStrengthsSeen.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center text-center lg:h-[600px]">
                <Varis
                  color="#fdd662"
                  width={160}
                  height={160}
                  className="my-12"
                />
                <h1 className="text-4xl font-bold">
                  {t('timeToSendStrengths', locale)}
                </h1>
              </div>
            ) : (
              <div className="h-[300px] lg:h-[600px]" />
            )}
            <div className="flex grow flex-col items-center justify-end pb-12">
              <ButtonWithLoader
                className="w-full max-w-sm bg-primary text-white"
                isLoading={isLoadingComplete}
                onClick={handleSessionComplete}
              >
                {t('endSession', locale)}
              </ButtonWithLoader>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
