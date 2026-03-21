import {getCookies} from 'next-client-cookies/server';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {ButtonWithTarget} from '@/app/games/session/ButtonWithTarget';
import {sp} from '@/app/games/session/_utils';

const texts = {
  title1: {
    'en-US': 'Time to send bonus strengths!',
    'fi-FI': 'Nyt lähetetään bonusvahvuuksia!',
    'sv-SE': 'Dags att skicka bonusstyrkor!',
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
};

export default async function GamesSessionPlayerSessionIdBonusStartPage(
  props: Props,
) {
  const {sessionId} = props.params;
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <FullHeightCentered requiredHeight={320}>
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <h1 className="mt-10 w-full max-w-xl text-base font-semibold text-white sm:text-lg">
                {t('title1', locale)}
              </h1>
            </div>
            <div className="mt-16 flex justify-center">
              <ButtonWithTarget
                target={sp(PATHS.strengthSessionPlayerBonus, sessionId)}
                className="w-full max-w-xs px-6 py-4"
              >
                {t('continue', locale)}
              </ButtonWithTarget>
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
