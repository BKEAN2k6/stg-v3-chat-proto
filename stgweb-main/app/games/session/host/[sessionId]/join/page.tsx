import {fetchStrengthSessionUsers, sp} from '../../../_utils';
import {JoinPage} from './JoinPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const getData = async (sessionId: string, joinShortCode: string) => {
  const PATH = `${sp(
    PATHS.strengthSessionJoinView,
    sessionId,
  )}?code=${joinShortCode}`;
  return serverDataQueryWrapper(PATH, async (directus) =>
    fetchStrengthSessionUsers(sessionId, directus),
  );
};

type Props = {
  params: {
    sessionId: string;
  };
  searchParams: {
    code: string;
  };
};

export default async function GamesSessionHostSessionIdJoinPage(props: Props) {
  const {sessionId} = props.params;

  const sessionUsers = await getData(sessionId, props.searchParams.code);

  return (
    <div>
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex h-[900px] w-full items-center justify-center bg-primary-darker-1">
          <JoinPage sessionId={sessionId} sessionUsers={sessionUsers} />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
