'use client';

import {useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import {useCookies} from 'next-client-cookies';
import seedrandom from 'seedrandom';
import {sp, wsevent} from '../../../_utils';
import {FlyingEmojisEffect} from '../../../FlyingEmojisEffect';
import {PeerStrengthsCarousel} from './PeerStrengthsCarousel';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import {shuffledAndPaddedStrengthSlugs} from '@/lib/strength-helpers';
import {delay, randomBetween} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';

function seededSort(array: string[], seed: string): string[] {
  const rng = seedrandom(seed);
  return array.slice().sort(() => rng() - 0.5);
}

export type Peer = {
  id: string;
  name: string;
  color: string;
};

const texts = {
  pickStrengthCaption: {
    'en-US': 'Pick a strength you have seen in this person',
    'fi-FI': 'Valitse vahvuus jota olet nähnyt tässä henkilössä',
    'sv-SE': 'Välj en styrka som du har sett hos den här personen',
  },
  error: {
    'en-US': 'Error',
    'fi-FI': 'Virhe',
    'sv-SE': 'Fel',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly strengthSession: any;
};

export const PeerStrengthsPage = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {strengthSession} = props;
  const [emojiBurstId, setEmojiBurstId] = useState(0);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [showCurrentPeerAndCarousel, setShowCurrentPeerAndCarousel] = useState(false); // prettier-ignore
  const [showNextPeerCenter, setShowNextPeerCenter] = useState(false);
  const [strengthsToList, setStrengthsToList] = useState(
    shuffledAndPaddedStrengthSlugs(),
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [peers, setPeers] = useState<Peer[]>();

  const [currentPeerIndex, setCurrentPeerIndex] = useState(-1);
  // we need access to the correct value of this this from an event listener, so
  // that's why the more complicated setter
  const currentPeerIndexRef = useRef(currentPeerIndex);
  const setCurrentPeerIndexRef = (newValue: number) => {
    currentPeerIndexRef.current = newValue;
    setCurrentPeerIndex(newValue);
  };

  const router = useRouter();

  const strengths = useMemo(
    () =>
      strengthsToList.map((slug) => ({
        data: {slug},
        isPlaceholder: false,
      })),
    [strengthsToList],
  );

  const sessionId = strengthSession.id;
  const {getLoggedInUserId} = useAuth();
  const room =
    strengthSession.rooms.find((room: string[]) =>
      room.includes(getLoggedInUserId() ?? ''),
    ) || [];
  const othersInRoom = room.filter(
    (uid: string) => uid !== getLoggedInUserId(),
  );
  const othersInRoomSorted = seededSort(
    othersInRoom,
    getLoggedInUserId() ?? '',
  );

  const handlePickStrength = async (slug: StrengthSlug) => {
    if (isLoadingNext) {
      return;
    }

    if (!peers) {
      return;
    }

    const currentPeer = peers[currentPeerIndex];
    if (!currentPeer) {
      return;
    }

    setIsLoadingNext(true);
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});
    const newStrength: any = await directus
      .items('strength_session_strength')
      .createOne({
        strength_session: sessionId,
        strength: StrengthIDMap[slug],
        user: currentPeer.id,
      });
    if (newStrength) {
      wsevent({
        sessionId,
        eventType: 'session_strength_seen',
        lookupValue: newStrength.id,
      });
    }

    setEmojiBurstId(randomBetween(1, Number.MAX_SAFE_INTEGER));
    handleTransitionToNext();
  };

  const handleRouletteComplete = () => {
    router.push(`${sp(PATHS.strengthSessionPlayerCongrats, sessionId)}?from=peer-strengths`); // prettier-ignore
  };

  const handleTransitionToNext = async (newPeers?: Peer[]) => {
    const peersList = newPeers ?? peers;
    if (!peersList) {
      return;
    }

    const nextPeerIndex = currentPeerIndexRef.current + 1;
    if (nextPeerIndex === peers?.length) {
      handleRouletteComplete();
      return;
    }

    // show next
    //
    await delay(500);
    setShowCurrentPeerAndCarousel(false);
    await delay(500);
    setCurrentPeerIndexRef(nextPeerIndex);
    setStrengthsToList(shuffledAndPaddedStrengthSlugs());
    setShowNextPeerCenter(true);
    await delay(2000);
    setShowNextPeerCenter(false);
    await delay(100);
    setEmojiBurstId(0);
    setShowCurrentPeerAndCarousel(true);

    setIsLoadingNext(false);
    setShowProgress(true);
  };

  const handleSetup = async () => {
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired();

    // fetch info for users in the room
    let newPeers: Peer[] = [];
    try {
      const query: any = await directus.items('directus_users').readByQuery({
        filter: {
          id: {
            _in: othersInRoomSorted,
          },
        },
      });
      newPeers = query.data.map((u: any) => ({
        id: u.id,
        name: u.first_name,
        color: u.color,
      }));
    } catch {
      setErrorMessage('failed-to-fetch');
      return;
    }

    // console.log(newPeers)
    setPeers(newPeers);

    // fetch strengths already seen by the logged in user
    let strengthsSeenByUser: Array<{user: string}>;
    try {
      const query: any = await directus
        .items('strength_session_strength')
        .readByQuery({
          filter: {
            user_created: {
              _eq: getLoggedInUserId(),
            },
          },
        });
      strengthsSeenByUser = query.data;
    } catch {
      setErrorMessage('failed-to-fetch');
      return;
    }

    // Identify the index of the last peer seen by the user in newPeers list
    const seenPeerIds = new Set(strengthsSeenByUser.map((item) => item.user));
    let lastSeenPeerIndex = -1;
    let i = 0;
    for (const newPeer of newPeers) {
      if (seenPeerIds.has(newPeer.id)) {
        lastSeenPeerIndex = i;
      }

      i += 1;
    }

    if (lastSeenPeerIndex + 1 === newPeers?.length) {
      handleRouletteComplete();
      return;
    }

    // If the last seen peer is found, set the currentPeerIndex to the next peer
    // NOTE: we increase this in handleTransitionToNext!
    setCurrentPeerIndexRef(lastSeenPeerIndex);

    handleTransitionToNext(newPeers);
  };

  useLegacyEffect(() => {
    const run = async () => {
      await handleSetup();
      setIsLoadingInit(false);
    };

    run();
  }, []);

  if (errorMessage) {
    // @TODO show button to reload the page and try again
    return <>{t('error', locale)}</>;
  }

  if (isLoadingInit || !peers) {
    return (
      <div className="min-safe-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const headingTranslation = t('pickStrengthCaption', locale);

  const headingText = showProgress
    ? `${headingTranslation} (${currentPeerIndex + 1}/${peers.length})`
    : headingTranslation;

  return (
    <>
      <h1 className="my-8 px-8 text-center text-lg font-bold">{headingText}</h1>
      <div className="relative min-h-[32rem]">
        <AnimatePresence>
          {/* {!showCurrentPeerAndCarousel && <div className="h-[27.8rem]"></div>} */}
          {showCurrentPeerAndCarousel && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.4, ease: 'backInOut'}}
            >
              <>
                <div className="mb-8 flex items-center justify-center">
                  <div
                    className="rounded-lg"
                    style={{
                      backgroundColor: peers?.[currentPeerIndex]?.color,
                    }}
                  >
                    <div className="px-4 py-2 text-center text-lg font-bold">
                      {peers?.[currentPeerIndex]?.name}
                    </div>
                  </div>
                </div>
                <PeerStrengthsCarousel
                  items={strengths}
                  onStrengthSelected={handlePickStrength}
                />
              </>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-8" />

      {/* next peer in center */}
      <div className="fixed inset-x-0 top-10 mx-auto">
        <AnimatePresence>
          {showNextPeerCenter && (
            <motion.div
              initial={{opacity: 0, scale: 0}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9, y: -90}}
              transition={{duration: 0.3, ease: 'backInOut'}}
            >
              <div className="mt-48 flex items-center justify-center">
                <div
                  className="rounded-lg"
                  style={{
                    backgroundColor: peers?.[currentPeerIndex]?.color,
                  }}
                >
                  <div className="px-4 py-2 text-center text-2xl font-bold">
                    {peers?.[currentPeerIndex]?.name}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {emojiBurstId > 0 && (
        <div className="fixed bottom-0 left-1/2 h-80 w-80 -translate-x-1/2">
          <FlyingEmojisEffect key={`emojis-${emojiBurstId}`} />
        </div>
      )}
    </>
  );
};
