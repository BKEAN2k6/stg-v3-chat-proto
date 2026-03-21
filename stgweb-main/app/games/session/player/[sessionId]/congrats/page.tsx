import {getCookies} from 'next-client-cookies/server';
import {ButtonWithTarget} from '../../../ButtonWithTarget';
import {sp} from '../../../_utils';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import ClientOnly from '@/components/ClientOnly';
import {FloatingHeartsBackground} from '@/components/FloatingHeartsBackground';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  statement1: {
    'en-US': 'Awesome!',
    'fi-FI': 'Mahtavaa!',
    'sv-SE': 'Häftigt!',
  },
  statement2: {
    'en-US': 'Great!',
    'fi-FI': 'Huippua!',
    'sv-SE': 'Toppen!',
  },
  statement3: {
    'en-US': 'Fantastic!',
    'fi-FI': 'Upeaa!',
    'sv-SE': 'Fantastiskt!',
  },
  continue: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätta',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  params: {
    sessionId: string;
  };
  searchParams?: {
    from?: string;
  };
};

export default async function GamesSessionPlayerSessionIdCongratsPage(
  props: Props,
) {
  const {sessionId} = props.params;
  const {from} = props.searchParams ?? {};
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  // default target to lobby
  let target = sp(PATHS.strengthSessionPlayerLobby, sessionId);
  let statement = 'statement1';

  if (from === 'own-strengths') {
    // target = sp(PATHS.strengthSessionPlayerOwnStrengthsComplete, sessionId)
    target = sp(PATHS.strengthSessionPlayerPeerStrengthsStart, sessionId);
    statement = 'statement1';
  }

  if (from === 'peer-strengths') {
    target = sp(PATHS.strengthSessionPlayerBonusStart, sessionId);
    statement = 'statement2';
  }

  if (from === 'bonus') {
    target = sp(PATHS.strengthSessionPlayerStats, sessionId);
    statement = 'statement3';
  }

  return (
    <div className="relative overflow-hidden">
      <ClientOnly>
        <FloatingHeartsBackground />
      </ClientOnly>
      <div className="absolute left-1/2 top-1/2 z-20 w-full max-w-sm -translate-x-1/2 -translate-y-1/2">
        <PageTransitionWrapper>
          <div className="flex h-full w-full flex-col items-center justify-center space-y-8">
            <h2 className="text-2xl font-bold text-black">
              {t(statement, locale)}
            </h2>
            <ButtonWithTarget target={target}>
              {t('continue', locale)}
            </ButtonWithTarget>
          </div>
        </PageTransitionWrapper>
      </div>
    </div>
  );
}
