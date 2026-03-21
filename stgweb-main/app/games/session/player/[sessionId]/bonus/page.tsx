import {fetchStrengthSession, sp} from '../../../_utils';
import {BonusPage} from './BonusPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const getData = async (sessionId: string) => {
  const PATH = sp(PATHS.strengthSessionPlayerBonus, sessionId);
  return serverDataQueryWrapper(PATH, async (directus) =>
    fetchStrengthSession(sessionId, directus),
  );
};

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdBonusPage(
  props: Props,
) {
  const {sessionId} = props.params;
  const strengthSession = await getData(sessionId);

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <BonusPage strengthSession={strengthSession} />
      </PageTransitionWrapper>
    </div>
  );
}
