'use client';

import {useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {AnimatePresence} from 'framer-motion';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {fetchStrengthSession, sp} from '../../../_utils';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {delay} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useWebSocket from '@/hooks/useWebSocket';
import {FadeInAndOut} from '@/components/FadeInAndOut';
import {Loader} from '@/components/atomic/atoms/Loader';
import {Varis} from '@/components/atomic/atoms/Varis';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  youAreIn: {
    'en-US': 'You are ready to go!',
    'fi-FI': 'Olet valmis aloittamaan!',
    'sv-SE': 'Du är redo att köra!',
  },
  waitingForSessionToStart: {
    'en-US': 'Hold on there, waiting for the sprint to start...',
    'fi-FI': 'Odotetaan että tuokio alkaa...',
    'sv-SE': 'Vänta lite, väntar på att sprinten ska börja...',
  },
  waitingForSessionToEnd: {
    'en-US': 'Waiting for the sprint to be completed...',
    'fi-FI': 'Odotetaan että tuokio päättyy',
    'sv-SE': 'Väntar på att sprinten ska slutföras...',
  },
  checkIfStarted: {
    'en-US': 'Check if sprint was started already',
    'fi-FI': 'Tarkasta onko tuokio jo aloitettu',
    'sv-SE': 'Kontrollera om sprint redan har påbörjats',
  },
  checkIfEnded: {
    'en-US': 'Check if sprint ended already',
    'fi-FI': 'Tarkasta onko tuokio jo lopetettu',
    'sv-SE': 'Kontrollera om sprinten redan avslutats',
  },
  stillWaitingForStart: {
    'en-US': 'Still waiting for the host to start the sprint',
    'fi-FI': 'Odotetaan vielä että tuokio aloitetaan',
    'sv-SE': 'Väntar fortfarande på att värden ska starta sprinten',
  },
  stillWaitingForEnd: {
    'en-US': 'Still waiting for the host to end the sprint',
    'fi-FI': 'Odotetaan vielä että tuokio päätetään',
    'sv-SE': 'Väntar fortfarande på att värden ska avsluta sprinten',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly sessionId: string;
};

// NOTE: this is a bit of an antipattern to declare a global variable, but
// should be fine in this case, since this is a single use component defining a
// page (so not used in multiple places ever)
let pollStartedInterval: any = null;

export const LobbyPage = (props: Props) => {
  const {sessionId} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {getLoggedInUserId} = useAuth();
  const router = useRouter();
  const searchParameters = useSearchParams();

  // we want to use this to immediately prevent further clicks when
  // handleCheckSessionStatus is first called, so that's why the more complex
  // setter
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const isCheckingStatusRef = useRef(isCheckingStatus);
  const setIsCheckingStatusRef = (newValue: boolean) => {
    isCheckingStatusRef.current = newValue;
    setIsCheckingStatus(newValue);
  };

  const isTheEnd = searchParameters.get('done') === '1';

  const handleSessionActivated = async () => {
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});
    let strengthSession;
    try {
      strengthSession = await fetchStrengthSession(sessionId, directus);
    } catch (error) {
      console.error('failed to get session', error);
    }

    // based on session "mode" go to proper location
    if (strengthSession.mode === 'group_strengths_only') {
      router.push(
        sp(PATHS.strengthSessionPlayerGroupStrengthsStart, sessionId),
      );
    }

    if (strengthSession.mode === 'own_and_peer_strengths_with_bonus') {
      router.push(sp(PATHS.strengthSessionPlayerOwnStrengthsStart, sessionId));
    }
  };

  const handleSessionCompleted = async () => {
    router.push(sp(PATHS.strengthSessionPlayerStats, sessionId));
  };

  type HandleCheckSessionStatusParameters = {
    fromInterval: boolean;
  };

  const handleCheckSessionStatus = async (
    parameters: HandleCheckSessionStatusParameters,
  ) => {
    const {fromInterval} = parameters;
    if (isCheckingStatusRef.current) {
      return;
    }

    // NOTE: this hides the button (using global variable because it fades out)
    if (!fromInterval) {
      setIsCheckingStatusRef(true);
    }

    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});
    let strengthSession;
    try {
      strengthSession = await fetchStrengthSession(sessionId, directus);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        window.location.href = '/start/join';
      } else {
        return;
      }
    }

    if (isTheEnd) {
      if (strengthSession.status === 'completed') {
        handleSessionCompleted();
        return;
      }

      if (!fromInterval) {
        toast(t('stillWaitingForEnd', locale), {duration: 3000});
      }
    } else {
      if (strengthSession.status === 'active') {
        handleSessionActivated();
        return;
      }

      if (!fromInterval) {
        toast(t('stillWaitingForStart', locale), {duration: 3000});
      }
    }

    await delay(3000);
    if (!fromInterval) {
      setIsCheckingStatusRef(false);
    }
  };

  useWebSocket({
    uid: `session-activated-${getLoggedInUserId()}`,
    // collection: "websocket_event",
    collection: 'strength_session_new_status',
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
        const newStatus = message.data[0].new_status;
        if (newStatus === 'active') {
          handleSessionActivated();
        }

        if (newStatus === 'completed') {
          handleSessionCompleted();
        }
      },
    },
  });

  useLegacyEffect(() => {
    // prefetch congrats screen, since it's likely a bit larger due to p5
    router.prefetch(sp(PATHS.strengthSessionPlayerCongrats, sessionId));
    // poll for session status (just in case websockets are not working)
    pollStartedInterval = setInterval(async () => {
      handleCheckSessionStatus({fromInterval: true});
    }, 5000);
    return () => {
      clearInterval(pollStartedInterval);
    };
  }, []);

  return (
    <div className="min-safe-h-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <div className="flex flex-col items-center justify-center px-4">
          <div className="my-12 sm:my-24">
            <Varis color="#fdd662" height={64} width={64} />
          </div>
          <h1 className="mb-4 text-lg font-bold text-white">
            {t('youAreIn', locale)}
          </h1>
          <div className="flex flex-col justify-center text-center text-white">
            {isTheEnd ? (
              <p>{t('waitingForSessionToEnd', locale)}</p>
            ) : (
              <p>{t('waitingForSessionToStart', locale)}</p>
            )}
            <div className="flex h-[120px] w-full items-center justify-center">
              <Loader />
            </div>
            <AnimatePresence mode="wait">
              {!isCheckingStatus && (
                <FadeInAndOut>
                  <a
                    href="#"
                    className="mt-16 text-xxs underline"
                    onClick={(event) => {
                      event.preventDefault();
                      handleCheckSessionStatus({
                        fromInterval: false,
                      });
                    }}
                  >
                    {isTheEnd ? (
                      <span>{t('checkIfEnded', locale)}</span>
                    ) : (
                      <span>{t('checkIfStarted', locale)}</span>
                    )}
                  </a>
                </FadeInAndOut>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
};
