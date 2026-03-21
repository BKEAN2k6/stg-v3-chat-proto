'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  StrengthIDMap,
  type StrengthSlug,
  StrengthSlugs,
} from '@/lib/strength-data';
import useAuth from '@/hooks/use-auth';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {StrengthFact} from '@/components/atomic/molecules/StrengthFact';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {ButtonWithTarget} from '@/app/games/session/ButtonWithTarget';
import {sp, wsevent} from '@/app/games/session/_utils';

const texts = {
  continue: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätta',
  },
  tryAgain: {
    'en-US': 'Try again',
    'fi-FI': 'Yritä uudelleen',
    'sv-SE': 'Försök igen',
  },
  backToStrengths: {
    'en-US': 'Back to strengths',
    'fi-FI': 'Takaisin vahvuuksiin',
    'sv-SE': 'Tillbaka till styrkor',
  },
  saveFailed: {
    'en-US': 'Failed to save strength!',
    'fi-FI': 'Vahvuuden tallentaminen epäonnistui!',
    'sv-SE': 'Misslyckades med att spara styrka!',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly params: {
    sessionId: string;
  };
  readonly searchParams: {
    strength?: StrengthSlug;
    from?: string;
  };
};

const GamesSessionPlayerSessionIdOwnStrengthsCompletePage = (props: Props) => {
  const {getLoggedInUserId} = useAuth();
  const router = useRouter();
  const cookies = useCookies();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const locale = getLocaleCode(cookies.get('locale'));

  const {sessionId} = props.params;
  const {strength} = props.searchParams || {};
  const nextButtonText = failed ? 'tryAgain' : 'continue';

  if (!strength || !StrengthSlugs.includes(strength)) {
    return (
      <div className="min-safe-h-screen">
        <PageTransitionWrapper>
          <FullHeightCentered requiredHeight={320}>
            <div className="flex flex-col">
              <ButtonWithTarget
                target={sp(PATHS.strengthSessionPlayerOwnStrengths, sessionId)}
                className="mb-8 w-full max-w-xs bg-primary px-6 py-4 text-white"
              >
                {t('backToStrengths', locale)}
              </ButtonWithTarget>
            </div>
          </FullHeightCentered>
        </PageTransitionWrapper>
      </div>
    );
  }

  const handleNext = async () => {
    setLoading(true);
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});

    try {
      const newStrength: any = await directus
        .items('strength_session_strength')
        .createOne({
          strength_session: sessionId,
          strength: StrengthIDMap[strength],
          user: getLoggedInUserId(),
          is_for_self: true,
        });

      if (newStrength) {
        wsevent({
          sessionId,
          eventType: 'session_strength_seen',
          lookupValue: newStrength.id,
        });
      }

      try {
        const user = await directus.users.me.read({
          fields: ['swl_wall'],
        });
        await directus.items('swl_moment').createOne({
          swl_item: {
            type: 'moment',
            swl_wall_links: [{swl_wall: user.swl_wall}],
          },
          strengths: [{strength: StrengthIDMap[strength]}],
          strength_session: sessionId,
          status: 'published',
        });
      } catch (error) {
        console.error(error);
      }

      router.push(sp(PATHS.strengthSessionPlayerPeerStrengthsStart, sessionId));
    } catch {
      setLoading(false);
      setFailed(true);
      toast.error(t('saveFailed', locale));
    }
  };

  return (
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div style={{backgroundColor: StrengthColorMap[strength][200]}}>
          <FullHeightCentered requiredHeight={320}>
            <div className="flex flex-col">
              <StrengthFact slug={strength} locale={locale} />
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <ButtonWithLoader
                  className="mb-4 w-full max-w-xs bg-primary py-3 text-white"
                  isLoading={loading}
                  onClick={handleNext}
                >
                  {t(nextButtonText, locale)}
                </ButtonWithLoader>
              </div>
              <div className="flex flex-col items-center text-center">
                <ButtonWithTarget
                  target={sp(
                    PATHS.strengthSessionPlayerOwnStrengths,
                    sessionId,
                  )}
                  className="mb-4 w-full max-w-xs bg-white py-3 text-primary"
                >
                  {t('backToStrengths', locale)}
                </ButtonWithTarget>
              </div>
            </div>
          </FullHeightCentered>
        </div>
      </PageTransitionWrapper>
    </div>
  );
};

export default GamesSessionPlayerSessionIdOwnStrengthsCompletePage;
