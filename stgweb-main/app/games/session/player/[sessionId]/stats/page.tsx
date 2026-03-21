import {type PlayerStrengthItem} from '../../../PlayerStats';
import {fetchStrengthSessionWithRelatedData, sp} from '../../../_utils';
import {PlayerStatsPage} from './PlayerStatsPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {type StrengthSlug, StrengthSlugMap} from '@/lib/strength-data';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

type SessionUser = {
  id: string;
  first_name: string;
};

type SessionStrength = {
  id: string;
  date_created: string;
  user_created: string;
  strength_session: string;
  strength: StrengthSlug;
  is_for_group: boolean | undefined;
  is_for_self: boolean | undefined;
  is_bonus: boolean | undefined;
  user: string;
};

const getData = async (sessionId: string) => {
  const PATH = sp(PATHS.strengthSessionPlayerStats, sessionId);
  return serverDataQueryWrapper(PATH, async (directus) => {
    const loggedInUser = await directus.users.me.read({
      fields: ['id', 'first_name', 'color'],
    });

    const strengthSessionWithRelatedData =
      await fetchStrengthSessionWithRelatedData(sessionId, directus);

    const sessionUsers: SessionUser[] = strengthSessionWithRelatedData.users;

    const sessionStrengths: SessionStrength[] =
      strengthSessionWithRelatedData.strength_session_strengths;

    const ownStrengths = sessionStrengths.filter(
      (u) => u.user === loggedInUser.id,
    );
    const enrichedStrengthsInUser = {} as Record<
      string,
      Omit<PlayerStrengthItem, 'slug'>
    >;

    for (const curr of ownStrengths) {
      if (curr.strength && curr.user_created) {
        if (!enrichedStrengthsInUser[curr.strength]) {
          enrichedStrengthsInUser[curr.strength] = {
            count: 0,
            from: [],
            seenAsBonus: false,
            seenInSelf: false,
          };
        }

        // increment count
        enrichedStrengthsInUser[curr.strength].count += 1;
        // flip a boolean if seen as a bonus
        if (curr.is_bonus) {
          enrichedStrengthsInUser[curr.strength].seenAsBonus = true;
        }

        // flip a boolean if seen in self
        if (curr.is_for_self) {
          enrichedStrengthsInUser[curr.strength].seenInSelf = true;
        }

        // figure out the "from" array
        const idsSeen = enrichedStrengthsInUser[curr.strength].from.map(
          (u) => u.id,
        );
        if (!idsSeen.includes(curr.user_created)) {
          const user = sessionUsers.find((u) => u.id === curr.user_created);
          enrichedStrengthsInUser[curr.strength].from.push({
            name: user?.first_name ?? '',
            id: curr.user_created,
            self: Boolean(curr.is_for_self),
          });
        }
      }
    }

    // convert ids to slugs
    const strengths = Object.entries(enrichedStrengthsInUser).map(
      ([id, rest]) => ({
        slug: StrengthSlugMap[id],
        ...rest,
      }),
    );

    return {
      date: strengthSessionWithRelatedData.date_created,
      playerName: loggedInUser.first_name ?? undefined,
      playerColor: loggedInUser.color,
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
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div className="flex items-center justify-center px-4">
          <PlayerStatsPage {...data} />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
