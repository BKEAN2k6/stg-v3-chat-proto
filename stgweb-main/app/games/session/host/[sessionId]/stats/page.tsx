import {fetchStrengthSessionWithRelatedData} from '../../../_utils';
import {type SessionStrength} from '../../../types';
import {SessionStatsPage} from './SessionStatsPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {StrengthSlugMap} from '@/lib/strength-data';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {sp} from '@/lib/utils';

const getData = async (sessionId: string) => {
  const PATH = sp(PATHS.strengthSessionStats, {sessionId});
  return serverDataQueryWrapper(PATH, async (directus) => {
    const strengthSessionWithRelatedData =
      await fetchStrengthSessionWithRelatedData(sessionId, directus);

    const sessionStrengths: SessionStrength[] =
      strengthSessionWithRelatedData.strength_session_strengths;

    const sessionUsers = strengthSessionWithRelatedData.users;

    const strengthsWithCount = {} as Record<string, number>;
    for (const curr of sessionStrengths) {
      if (curr.strength) {
        strengthsWithCount[curr.strength] =
          (strengthsWithCount[curr.strength] || 0) + 1;
      }
    }

    const strengths = Object.entries(strengthsWithCount)
      .map(([id, count]) => ({
        slug: StrengthSlugMap[id],
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      date: strengthSessionWithRelatedData.date_created,
      groupDetails: {
        name: strengthSessionWithRelatedData.group.name,
        participantCount: sessionUsers.length,
        strengthCount: sessionStrengths.length,
      },
      strengths,
    };
  });
};

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionHostSessionIdJoinPage(props: Props) {
  const {sessionId} = props.params;
  const data = await getData(sessionId);

  return (
    <div>
      <PageTransitionWrapper>
        <div className="flex items-center justify-center px-4">
          <SessionStatsPage {...data} />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
