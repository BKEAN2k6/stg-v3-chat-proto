import {ErrorWithRefreshButton} from '../../../ErrorWithRefreshButton';
import {fetchStrengthSession, sp} from '../../../_utils';
import {PeerStrengthsPage} from './PeerStrengthsPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const getData = async (sessionId: string) => {
  const PATH = sp(PATHS.strengthSessionPlayerPeerStrengths, sessionId);
  return serverDataQueryWrapper(PATH, async (directus) =>
    fetchStrengthSession(sessionId, directus),
  );
};

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdPeerStrengthsPage(
  props: Props,
) {
  const {sessionId} = props.params;
  const strengthSession = await getData(sessionId);

  if (!strengthSession) {
    return <ErrorWithRefreshButton />;
  }

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <PeerStrengthsPage strengthSession={strengthSession} />
      </PageTransitionWrapper>
    </div>
  );
}
