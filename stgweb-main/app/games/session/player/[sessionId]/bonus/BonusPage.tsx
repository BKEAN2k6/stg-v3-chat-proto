'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {
  fetchStrengthSession,
  fetchStrengthSessionUsers,
  sp,
  wsevent,
} from '../../../_utils';
import {BonusCarousel, type SlideItem} from './BonusCarousel';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {
  StrengthIDMap,
  type StrengthSlug,
  StrengthSlugs,
} from '@/lib/strength-data';
import {getRandomItem} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';
import {StrengthIconNameAndExample} from '@/components/atomic/molecules/StrengthIconNameAndExample';

export type DatabaseUser = {
  id: string;
  first_name: string;
  color: string;
};

export type UserInSlider = {
  id: string;
  name: string;
  color: string;
};

// NOTE: this is only fine because this is a not a component meant to be used
// from anywhere else. This keeps track of the ids user has given bonus to on
// the client. When page is refreshed, the setup function runs again, leaving
// out the users they have given a bonus to in there.
let users: DatabaseUser[] = [];
const bonusGivenTo: string[] = [];

let blockedInterval: any = null;
let blockedForMillis = 0;

const BLOCKED_TIMER_MILLIS = 10000;

const texts = {
  whoHaveYouSeenThisIn: {
    'en-US': 'Who have you seen this strength in?',
    'fi-FI': 'Kenessä olet nähnyt tätä vahvuutta?',
    'sv-SE': 'Vem har du sett denna styrka hos?',
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

export const BonusPage = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {strengthSession} = props;
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isUsersSet, setIsUsersSet] = useState(false);
  const [carouselInstanceKey, setCarouselInstanceKey] = useState('initial');
  const [blockedTimer, setBlockedTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [usersForSlider, setUsersForSlider] = useState<SlideItem[]>();
  const [currentStrength, setCurrentStrength] = useState<StrengthSlug>();
  const [usersAvailable, setUsersAvailable] = useState(0);
  const router = useRouter();

  const sessionId = strengthSession.id;
  const {getLoggedInUserId} = useAuth();

  const handlePickUser = async (id: string) => {
    if (blockedTimer !== 0) {
      return;
    }

    if (!currentStrength) {
      return;
    }

    bonusGivenTo.push(id);
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});
    const newStrength: any = await directus
      .items('strength_session_strength')
      .createOne({
        strength_session: sessionId,
        strength: StrengthIDMap[currentStrength],
        user: id,
        is_bonus: true,
      });
    if (newStrength) {
      wsevent({
        sessionId,
        eventType: 'session_strength_seen',
        lookupValue: newStrength.id,
      });
    }

    handleTransitionToNext();
  };

  const handleTransitionToNext = async () => {
    if (usersAvailable - 1 <= 0) {
      handleBonusRoundComplete();
      return;
    }

    setUsersAvailable(usersAvailable - 1);
    blockedForMillis = BLOCKED_TIMER_MILLIS;
    setBlockedTimer(blockedForMillis);
    blockedInterval = setInterval(async () => {
      blockedForMillis -= 1000;
      setBlockedTimer(blockedForMillis);
      if (blockedForMillis <= 0) {
        clearInterval(blockedInterval);
        await handleCheckSessionStatus();
        setCarouselInstanceKey(`instance-${Math.random()}`);
        handleNewRound();
      }
    }, 1000);
    await handleCheckSessionStatus();
  };

  const handleBonusRoundComplete = () => {
    router.push(sp(`${PATHS.strengthSessionPlayerLobby}?done=1`, sessionId));
  };

  const handleSetup = async () => {
    // NOTE: we don't need to limit to only the users in the room during the bonus round
    const directus = createClientSideDirectusClient();
    try {
      await refreshAuthIfExpired();
      users = await fetchStrengthSessionUsers(sessionId, directus);
    } catch {
      setErrorMessage('failed-to-fetch');
      return;
    }

    // fetch bonus strengths already seen by the logged in user
    let strengthsSeenByUser: Array<{user: string}>;
    try {
      const query: any = await directus
        .items('strength_session_strength')
        .readByQuery({
          filter: {
            _and: [
              {
                user_created: {
                  _eq: getLoggedInUserId(),
                },
              },
              {
                is_bonus: {
                  _eq: true,
                },
              },
            ],
          },
        });
      strengthsSeenByUser = query.data;
    } catch {
      setErrorMessage('failed-to-fetch');
      return;
    }

    // remove users current user has already given a bonus strength to from the final list of users
    for (const row of strengthsSeenByUser) {
      bonusGivenTo.push(row.user);
    }

    const bonusLeftToGive = users.filter(
      (user) =>
        // REFACTORING NOTE: very prone to bugs if not checked correctly, this
        // whole page has been written quite fast and in need of refactoring...
        !bonusGivenTo.includes(user.id) && user.id !== getLoggedInUserId(),
    ).length;

    // go to end screen if already seen something in everyone
    if (bonusLeftToGive === 0) {
      handleBonusRoundComplete();
      return;
    }

    setUsersAvailable(bonusLeftToGive);

    // @TODO have a list of strengths for the session to look from...
    setCurrentStrength(getRandomItem([...StrengthSlugs]) as StrengthSlug);

    handleSetUsersForSlider();
  };

  const handleSetUsersForSlider = () => {
    // This odd looking logic exists to make sure we always get 9 items in the
    // carousel, so that the library used to render the slides gets enough
    // pages to render the slider properly. The ones that are not "real", are
    // marked as placeholders. This isn't the correct place to have this
    // logic, but since the slider thing overall was still kind of looking for
    // it's final form while this was being built, it was easier to do things
    // like this instead of adding more complexity to the slider components.
    const usersToList = users.filter(
      (user) =>
        // REFACTORING NOTE: very prone to bugs if not checked correctly, this
        // whole page has been written quite fast and in need of refactoring...
        !bonusGivenTo.includes(user.id) && user.id !== getLoggedInUserId(),
    );
    const newUsersForSlider = usersToList.map((user) => ({
      data: {
        id: user.id,
        name: user.first_name,
        color: user.color,
      },
      isPlaceholder: false,
    }));
    if (usersToList.length < 9) {
      for (let idx = usersToList.length; idx < 9; idx += 1) {
        newUsersForSlider.push({
          data: {id: '', name: '', color: ''},
          isPlaceholder: true,
        });
      }
    }

    setUsersForSlider(newUsersForSlider);
    setIsUsersSet(true);
  };

  const handleNewRound = () => {
    // @TODO have a list of strengths for the session to look from...
    setCurrentStrength(getRandomItem([...StrengthSlugs]) as StrengthSlug);

    handleSetUsersForSlider();
    /*
    setUsersForSlider((currentValue) => {
      return currentValue?.map((value) => {
        // we basically turn a carousel item for the user that has a bonus given
        // to the into a placeholder, so it'll not be visible anymore but still
        // leave the required amount of items to the slideshow component.
        if (bonusGivenTo.includes(value.data.id)) {
          const newValue = { ...value }
          newValue.isPlaceholder = true
          return newValue
        }
        return value
      })
    })
    */
  };

  const handleCheckSessionStatus = async () => {
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});
    let strengthSession;
    try {
      strengthSession = await fetchStrengthSession(sessionId, directus);
    } catch (error) {
      console.error('failed to get session', error);
    }

    if (strengthSession.status === 'completed') {
      router.push(sp(PATHS.strengthSessionPlayerStats, sessionId));
    }
  };

  const calculatePieSlice = () =>
    100 - (blockedTimer / BLOCKED_TIMER_MILLIS) * 100;

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

  if (isLoadingInit || !isUsersSet || !currentStrength) {
    return (
      <div className="min-safe-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <h1 className="my-8 px-8 text-center text-lg font-bold">
        {t('whoHaveYouSeenThisIn', locale)}
      </h1>
      <div className="mb-8 flex items-center justify-center px-8">
        <div className="w-full max-w-[360px]">
          <StrengthIconNameAndExample slug={currentStrength} />
        </div>
      </div>
      <BonusCarousel
        key={carouselInstanceKey}
        items={usersForSlider}
        onItemSelected={handlePickUser}
      />
      <div className="h-8" />

      {blockedTimer > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            pointerEvents: 'auto',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `conic-gradient(
                transparent 0% ${calculatePieSlice()}%, 
                #9074D3 ${calculatePieSlice()}% 100%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {Math.ceil(blockedTimer / 1000)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
