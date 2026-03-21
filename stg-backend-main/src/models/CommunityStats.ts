import type Redis from 'ioredis';
import {getWeek, getDay} from 'date-fns';
import {type StrengthSlug} from '../api/client/ApiTypes';
import {User} from '.';

export class CommunityStats {
  static getWeek: (date: Date) => number = (date) => {
    return getWeek(date, {weekStartsOn: 1});
  };

  constructor(private readonly redis: Redis) {}

  updateCommunityStrenghts = async (
    communityId: string,
    date: Date,
    newStrengths: StrengthSlug[],
    oldStrengths: StrengthSlug[] = [],
  ): Promise<void> => {
    const weekNumber = CommunityStats.getWeek(date);
    const key = this.getTopStrengthsKey(communityId, weekNumber);
    const strengthToRemove = oldStrengths.filter(
      (strength) => !newStrengths.includes(strength),
    );
    const strengthToAdd = newStrengths.filter(
      (strength) => !oldStrengths.includes(strength),
    );

    const pipeline = this.redis.pipeline();
    for (const strength of strengthToRemove) {
      pipeline.zincrby(key, -1, strength);
    }

    for (const strength of strengthToAdd) {
      pipeline.zincrby(key, 1, strength);
    }

    pipeline.expire(key, 60 * 60 * 24 * 7);
    await pipeline.exec();
  };

  updateMoodMeter = async (
    communityId: string,
    date: Date,
    mood: number,
  ): Promise<void> => {
    const dayNumber = getDay(date);
    const key = this.getMoodMeterKey(communityId, dayNumber);

    const pipeline = this.redis.pipeline();
    pipeline.hincrby(key, mood.toString(), 1);
    pipeline.expire(key, 60 * 60 * 24);
    await pipeline.exec();
  };

  updateLeaderboard = async (
    userId: string,
    communityId: string,
    date: Date,
    count: number,
  ): Promise<void> => {
    const weekNumber = CommunityStats.getWeek(date);
    const key = this.getLeaderboardkey(communityId, weekNumber);

    const pipeline = this.redis.pipeline();
    pipeline.zincrby(key, count, userId);
    pipeline.expire(key, 60 * 60 * 24 * 7);
    await pipeline.exec();
  };

  getCommunityStats = async (
    communityId: string,
    date: Date,
  ): Promise<{
    topStrengths: Array<{strength: StrengthSlug; count: number}>;
    leaderboard: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      count: number;
      avatar: string;
    }>;
    moodMeter: Array<{mood: number; count: number}>;
  }> => {
    const weekNumber = CommunityStats.getWeek(date);
    const dayNumber = getDay(date);

    const [topStrengths, leaderboard, moodMeter] = await Promise.all([
      this.getTopStrengths(communityId, weekNumber),
      this.getLeaderboard(communityId, weekNumber),
      this.getMooodMeter(communityId, dayNumber),
    ]);

    return {
      topStrengths,
      leaderboard,
      moodMeter,
    };
  };

  getMooodMeter = async (
    communityId: string,
    dayNumber: number,
  ): Promise<Array<{mood: number; count: number}>> => {
    const moodMeterRaw = await this.redis.hgetall(
      this.getMoodMeterKey(communityId, dayNumber),
    );

    return this.parseMoodMeter(moodMeterRaw);
  };

  private readonly getTopStrengths = async (
    communityId: string,
    weekNumber: number,
  ): Promise<Array<{strength: StrengthSlug; count: number}>> => {
    const topStrengthsRaw = await this.redis.zrevrange(
      this.getTopStrengthsKey(communityId, weekNumber),
      0,
      -1,
      'WITHSCORES',
    );

    return this.parseTopStrengths(topStrengthsRaw);
  };

  private readonly getLeaderboard = async (
    communityId: string,
    weekNumber: number,
  ): Promise<
    Array<{
      _id: string;
      firstName: string;
      lastName: string;
      count: number;
      avatar: string;
    }>
  > => {
    const leaderboardRaw = await this.redis.zrevrange(
      this.getLeaderboardkey(communityId, weekNumber),
      0,
      -1,
      'WITHSCORES',
    );

    return this.populateLeaderboard(leaderboardRaw);
  };

  private readonly getLeaderboardkey: (
    communityId: string,
    weekNumber: number,
  ) => string = (communityId, weekNumber) =>
    `community:${communityId}:leaderboard:${weekNumber}`;

  private readonly getTopStrengthsKey: (
    communityId: string,
    weekNumber: number,
  ) => string = (communityId, weekNumber) =>
    `community:${communityId}:top-strengths:${weekNumber}`;

  private readonly getMoodMeterKey: (
    communityId: string,
    dayNumber: number,
  ) => string = (communityId, dayNumber) =>
    `community:${communityId}:mood-meter:${dayNumber}`;

  private readonly populateLeaderboard = async (
    leaderboardRaw: string[],
  ): Promise<
    Array<{
      _id: string;
      firstName: string;
      lastName: string;
      count: number;
      avatar: string;
    }>
  > => {
    const unpopulatedLeaderBoard: Array<{userId: string; count: number}> = [];
    for (let i = 0; i < leaderboardRaw.length; i += 2) {
      unpopulatedLeaderBoard.push({
        userId: leaderboardRaw[i],
        count: Number.parseInt(leaderboardRaw[i + 1], 10),
      });
    }

    const leaderBoardUsers = unpopulatedLeaderBoard.map((user) => user.userId);
    const users = await User.find({
      _id: {$in: leaderBoardUsers},
    }).select('_id firstName lastName avatar');

    const leaderboard = unpopulatedLeaderBoard.map(({userId, count}) => {
      const databaseUser = users.find(({_id}) => _id.toHexString() === userId);
      if (!databaseUser) {
        return {
          _id: userId,
          firstName: 'Unknown',
          lastName: 'User',
          avatar: '',
          count,
        };
      }

      return {...databaseUser.toObject(), _id: userId, count};
    });

    return leaderboard;
  };

  private readonly parseTopStrengths = (
    topStrengthsRaw: string[],
  ): Array<{strength: StrengthSlug; count: number}> => {
    const stats: Array<{strength: StrengthSlug; count: number}> = [];
    for (let i = 0; i < topStrengthsRaw.length; i += 2) {
      stats.push({
        strength: topStrengthsRaw[i] as StrengthSlug,
        count: Number.parseInt(topStrengthsRaw[i + 1], 10),
      });
    }

    return stats;
  };

  private readonly parseMoodMeter = (
    moodMeterRaw: Record<string, string>,
  ): Array<{mood: number; count: number}> => {
    const stats: Array<{mood: number; count: number}> = [
      {mood: 1, count: 0},
      {mood: 2, count: 0},
      {mood: 3, count: 0},
      {mood: 4, count: 0},
      {mood: 5, count: 0},
    ];

    for (const mood in moodMeterRaw) {
      if (Object.hasOwn(moodMeterRaw, mood)) {
        stats[Number.parseInt(mood, 10) - 1].count = Number.parseInt(
          moodMeterRaw[mood],
          10,
        );
      }
    }

    return stats;
  };
}
