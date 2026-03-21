import {type SessionStrength} from '../../../types';
import {fetchStrengthSessionWithRelatedData} from '../../../_utils';
import {ErrorWithRefreshButton} from '../../../ErrorWithRefreshButton';
import {RevealTopStrength} from './RevealTopStrength';
import {RedirectToStats} from './RedirectToStats';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {sp} from '@/lib/utils';
import {PATHS} from '@/constants.mjs';
import {StrengthSlugMap} from '@/lib/strength-data';

type Props = {
  params: {
    sessionId: string;
  };
};

const getData = async (sessionId: string) => {
  const PATH = sp(PATHS.strengthSessionCompleteTransition, {sessionId});
  return serverDataQueryWrapper(PATH, async (directus) => {
    const strengthSessionWithRelatedData =
      await fetchStrengthSessionWithRelatedData(sessionId, directus);

    const sessionStrengths: SessionStrength[] =
      strengthSessionWithRelatedData.strength_session_strengths;

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
      topStrengthSlug: strengths?.[0]?.slug,
      topStrengthCount: strengths?.[0]?.count,
    };
  });
};

export default async function GamesSessionHostSessionIdCompleteTransitionPage(
  props: Props,
) {
  const {sessionId} = props.params;

  const data = await getData(sessionId);
  if (!data) {
    return <ErrorWithRefreshButton />;
  }

  const {topStrengthSlug, topStrengthCount} = data;

  // shouldn't really happen, but if there was no strength seen in the session,
  // we can handle things without errors by just going directly to the stats
  // page...
  if (!topStrengthSlug || !topStrengthCount) {
    return <RedirectToStats sessionId={sessionId} />;
  }

  return (
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div className="flex items-center justify-center">
          <RevealTopStrength
            sessionId={sessionId}
            topStrengthCount={topStrengthCount}
            topStrengthSlug={topStrengthSlug}
          />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
