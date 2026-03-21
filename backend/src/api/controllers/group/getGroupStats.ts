import {type Request, type Response} from 'express';
import {type Types} from 'mongoose';
import {
  Group,
  Article,
  GroupGame,
  StrengthGoal,
} from '../../../models/index.js';
import {
  type GetGroupStatsParameters,
  type GetGroupStatsResponse,
  type StrengthSlug,
  type ArticleChapter,
  type AgeGroup,
} from '../../client/ApiTypes.js';
import {getCompletedDiplomas} from '../../../services/AiGuidanceService/diplomaCount.js';
import {calculateStreak} from '../../../services/AiGuidanceService/streakCalculation.js';

export async function getGroupStats(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetGroupStatsParameters;

  const group = await Group.findById(id);

  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  // --- Lessons ---
  const lessonCount = group.articleProgress.length;
  const lessonDates = group.articleProgress.map(
    (p) => new Date(p.completionDate),
  );
  const lastLessonDate =
    lessonDates.length > 0
      ? new Date(Math.max(...lessonDates.map((d) => d.getTime())))
      : undefined;

  // --- Diplomas ---
  const timelineArticles = await Article.find({
    isTimelineArticle: true,
    isHidden: false,
  })
    .select('_id timelineStrength timelineChapter timelineAgeGroup')
    .lean<
      Array<{
        _id: Types.ObjectId;
        timelineStrength: StrengthSlug;
        timelineChapter: ArticleChapter;
        timelineAgeGroup: AgeGroup;
      }>
    >()
    .exec();

  const readArticles = group.articleProgress.map((p) => ({
    article: p.article._id.toJSON(),
    completionDate: new Date(p.completionDate).toISOString(),
  }));

  const completedDiplomas = getCompletedDiplomas(
    timelineArticles.map((a) => ({
      id: a._id.toString(),
      strength: a.timelineStrength,
      chapter: a.timelineChapter,
      ageGroup: a.timelineAgeGroup,
    })),
    readArticles,
  );

  const diplomaCount = completedDiplomas.length;
  const lastDiplomaDate =
    completedDiplomas.length > 0
      ? new Date(
          Math.max(...completedDiplomas.map((d) => d.completionDate.getTime())),
        )
      : undefined;

  // --- Games ---
  const allGameTypes = ['memory-game', 'sprint'] as const;

  const [gamesByType, lastGame] = await Promise.all([
    GroupGame.aggregate<{_id: string; count: number}>([
      {$match: {group: group._id, isEnded: true}},
      {$group: {_id: '$gameType', count: {$sum: 1}}},
    ]),
    GroupGame.findOne({group: group._id, isEnded: true})
      .sort({updatedAt: -1})
      .select('updatedAt')
      .lean<{updatedAt: Date}>()
      .exec(),
  ]);

  const countMap = new Map(gamesByType.map((g) => [g._id, g.count]));
  const byType = allGameTypes.map((slug) => ({
    slug,
    count: countMap.get(slug) ?? 0,
  }));
  const gameCount = byType.reduce((sum, g) => sum + g.count, 0);

  const lastGameDate = lastGame ? new Date(lastGame.updatedAt) : undefined;

  // --- Goals (finished) ---
  const allGoals = await StrengthGoal.find({group: group._id})
    .lean<
      Array<{
        events: Array<{createdAt: Date}>;
        target: number;
      }>
    >()
    .exec();

  const finishedGoals = allGoals.filter((g) => g.events.length >= g.target);
  const goalCount = finishedGoals.length;

  let lastGoalDate: Date | undefined;
  for (const goal of finishedGoals) {
    const lastEvent = goal.events.at(-1);
    if (lastEvent) {
      const eventDate = new Date(lastEvent.createdAt);
      if (!lastGoalDate || eventDate > lastGoalDate) {
        lastGoalDate = eventDate;
      }
    }
  }

  // --- Streak ---
  const activities: Array<{date: Date}> = [];

  for (const entry of group.articleProgress) {
    activities.push({date: new Date(entry.completionDate)});
  }

  for (const goal of allGoals) {
    for (const event of goal.events) {
      activities.push({date: new Date(event.createdAt)});
    }
  }

  if (lastGameDate) {
    activities.push({date: lastGameDate});
  }

  const streak = calculateStreak(activities);

  response.json({
    lessons: {
      count: lessonCount,
      updatedAt: lastLessonDate?.toJSON(),
    },
    diplomas: {
      count: diplomaCount,
      updatedAt: lastDiplomaDate?.toJSON(),
    },
    games: {
      count: gameCount,
      updatedAt: lastGameDate?.toJSON(),
      byType,
    },
    goals: {
      count: goalCount,
      updatedAt: lastGoalDate?.toJSON(),
    },
    streak,
  } satisfies GetGroupStatsResponse);
}
