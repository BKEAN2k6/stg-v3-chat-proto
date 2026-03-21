import {type NextRequest} from 'next/server';
import {
  fetchStrengthSession,
  fetchStrengthSessionStrengths,
  fetchStrengthSessionUsers,
} from '../../../_utils';
import {createServerSideDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

type SessionStrength = {
  strength: string;
  user: string;
  user_created: string;
  is_for_self: boolean;
  is_for_group: boolean;
  is_bonus: boolean;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const authToken = request.cookies.get('auth_token')?.value ?? '';

  const directus = await createServerSideDirectusClient({authToken});

  const session = await fetchStrengthSession(body.sessionId, directus);
  const users = await fetchStrengthSessionUsers(body.sessionId, directus);
  const strengths = await fetchStrengthSessionStrengths(
    body.sessionId,
    directus,
  );

  const userCompletionPercentages: number[] = [];

  if (session.mode === 'group_strengths_only') {
    for (const user of users) {
      const userStrengths = strengths.filter(
        (strength: SessionStrength) => strength.user_created === user.id,
      );
      userCompletionPercentages.push(userStrengths.length > 0 ? 100 : 0);
    }
  }

  if (session.mode === 'own_and_peer_strengths_with_bonus') {
    const STRENGTHS_SEEN_IN_SELF = 1;

    for (const user of users) {
      const roomIndex = session.rooms.findIndex((room: string[]) =>
        room.includes(user.id),
      );
      const room: string = session.rooms[roomIndex];

      // count strengths added by user
      const userStrengths = strengths.filter(
        (strength: SessionStrength) => strength.user_created === user.id,
      );

      // count strengths added to self
      const selfStrengths = userStrengths.filter(
        (strength: SessionStrength) => strength.is_for_self,
      ).length;

      // count strengths added to others in the room
      const roomStrengths = userStrengths.filter(
        (strength: SessionStrength) => strength.user,
      ).length;
      // console.log('roomStrengths', roomStrengths);

      // count bonus strengths added
      const bonusStrengths = userStrengths.filter(
        (strength: SessionStrength) => strength.is_bonus,
      ).length;

      // Calculate the number of self strengths
      const selfStrengthsCount = Math.min(
        selfStrengths,
        STRENGTHS_SEEN_IN_SELF,
      );
      // console.log("selfStrengthsCount", selfStrengthsCount)

      // Calculate the number of group strengths (capped at the number of other people in the room)
      const roomStrengthsCount = Math.min(roomStrengths, room.length - 1);
      // console.log("roomStrengthsCount", roomStrengthsCount)

      // Calculate the number of bonus strengths (capped at 1)
      const bonusStrengthsCount = Math.min(bonusStrengths, 1);
      // console.log("bonusStrengthsCount", bonusStrengthsCount)

      // Calculate the maximum possible points that can be scored
      const maxPoints = STRENGTHS_SEEN_IN_SELF + room.length - 1 + 1; // for self, room.length - 1 for group, and 1 for bonus

      // Calculate the actual points scored by the user
      const actualPoints =
        selfStrengthsCount + roomStrengthsCount + bonusStrengthsCount;

      // Calculate the completion percentage
      const completionPercentage = (actualPoints / maxPoints) * 100;

      userCompletionPercentages.push(completionPercentage);
    }
  }

  const playersStarted = userCompletionPercentages.filter(
    (percentage) => percentage > 0,
  ).length;

  const playersCompleted = userCompletionPercentages.filter(
    (percentage) => percentage === 100,
  ).length;

  const medianCompletePercentage = userCompletionPercentages.sort(
    (a, b) => a - b,
  )[Math.floor(userCompletionPercentages.length / 2)];

  const averageCompletePercentage =
    userCompletionPercentages.reduce((sum, curr) => sum + curr, 0) /
    userCompletionPercentages.length;

  try {
    return respond(200, 'ok', {
      playersJoined: users.length,
      playersStarted,
      playersCompleted,
      medianCompletePercentage,
      averageCompletePercentage,
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed');
  }
}
