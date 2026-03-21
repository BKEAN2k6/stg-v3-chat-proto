import {getCookies} from 'next-client-cookies/server';
import {ClearSessionButton} from './ClearSessionButton';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {sp} from '@/lib/utils';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {Varis} from '@/components/atomic/atoms/Varis';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  pageTitle: {
    'en-US': 'You seem to have been in a strength sprint',
    'sv-SE': 'Du verkar ha varit med i en styrkesprint',
    'fi-FI': 'Olit nähtävästi vahvuustuokiossa',
  },
  backToSprint: {
    'en-US': 'Go back to the sprint',
    'sv-SE': 'Gå tillbaka till sprinten',
    'fi-FI': 'Palaa vahvuustuokioon',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const PATH = '/errors/login-needed';

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => {
    const user = await directus.users.me.read();
    const strengthSession: any = await directus
      .items('strength_session')
      .readOne(user.active_strength_session);
    return {
      userFirstName: user?.first_name,
      sessionId: strengthSession?.id,
      sessionStatus: strengthSession?.status,
    };
  });

export default async function ErrorsLoginNeededPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {sessionId, sessionStatus, userFirstName} = (await getData()) ?? {};

  let sessionLinkTarget;

  // handle link target for a started session
  if (sessionStatus === 'started') {
    sessionLinkTarget = sp(PATHS.strengthSessionPlayerLobby, {
      sessionId,
    });
    if (!userFirstName || userFirstName.trim() === '') {
      // if user has no name and the session is not yet active or completed,
      // target the hello page for user to set their name
      sessionLinkTarget = sp(PATHS.strengthSessionPlayerHello, {sessionId});
    }
  }

  // handle link target for an active session
  if (sessionStatus === 'active') {
    // NOTE: this isn't 100% optimal as it will always take the user to the
    // beginning (through lobby first, so the redirect logic forward can be
    // determined there and does not have to be repeted here). Adding the
    // complexity to determine the position where the user was starts to get
    // quite complicated already, and it's very unlikely they will end up here
    // in anycase... (but still @TODO if this is more relevant at some point)
    sessionLinkTarget = sp(PATHS.strengthSessionPlayerLobby, {
      sessionId,
    });
    if (!userFirstName || userFirstName.trim() === '') {
      // if user has no name and the session is already active, there's not
      // really much we can do, so just don't show the button...
      sessionLinkTarget = null;
    }
  }

  // handle link target for a completed session
  if (sessionStatus === 'completed') {
    sessionLinkTarget = sp(PATHS.strengthSessionPlayerStats, {
      sessionId,
    });
    if (!userFirstName || userFirstName.trim() === '') {
      // if user has no name and the session is already completed, there's not
      // really much we can do, so just don't show the button...
      sessionLinkTarget = null;
    }
  }

  return (
    <div className="min-safe-h-screen w-screen bg-primary-darker-1">
      <PageTransitionWrapper>
        <FullHeightCentered>
          <div className="flex flex-col items-center text-center text-white">
            <Varis color="#fdd662" width={64} height={64} className="mb-12" />
            <h1 className="mb-12 px-4 text-xl font-semibold">
              {t('pageTitle', locale)}
            </h1>
            <div className="flex w-full max-w-sm flex-col items-center space-y-6 px-4">
              {sessionLinkTarget && (
                <LinkButtonWithLoader
                  href={sessionLinkTarget}
                  className="w-full"
                >
                  {t('backToSprint', locale)}
                </LinkButtonWithLoader>
              )}
              <ClearSessionButton locale={locale} />
            </div>
          </div>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
