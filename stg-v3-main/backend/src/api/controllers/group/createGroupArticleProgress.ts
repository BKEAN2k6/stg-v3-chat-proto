import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  Group,
  LessonCompleted,
  StrengthCompleted,
  Article,
} from '../../../models/index.js';
import {
  type CreateGroupArticleProgressParameters,
  type CreateGroupArticleProgressRequest,
  type CreateGroupArticleProgressResponse,
} from '../../client/ApiTypes.js';

const allChapters = ['start', 'speak', 'act', 'assess'] as const;

export async function createGroupArticleProgress(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateGroupArticleProgressParameters;
  const {article, isSkipped} =
    request.body as CreateGroupArticleProgressRequest;
  const completionDate = new Date();

  const group = await Group.findOneAndUpdate(
    {_id: id, 'articleProgress.article': {$ne: article}},
    {
      $push: {
        articleProgress: {
          article,
          completionDate,
        },
      },
    },
  );

  if (!isSkipped && group) {
    const lessonArticle = await Article.findById(article);
    if (!lessonArticle) {
      throw new Error('Lesson article not found');
    }

    const {timelineAgeGroup, timelineChapter, timelineStrength} = lessonArticle;

    if (!timelineAgeGroup || !timelineChapter || !timelineStrength) {
      throw new Error('Lesson article is missing timeline information');
    }

    await LessonCompleted.create({
      community: group.community,
      strength: timelineStrength,
      chapter: timelineChapter,
      ageGroup: timelineAgeGroup,
      group: group._id,
      createdBy: new mongoose.Types.ObjectId(request.user.id),
    });

    const readArticleIds = [
      ...group.articleProgress.map((progress) => progress.article),
      article,
    ];

    const completedChapters = await Article.distinct('timelineChapter', {
      _id: {$in: readArticleIds},
      timelineStrength,
      timelineAgeGroup,
      timelineChapter: {$in: allChapters},
    });

    if (completedChapters.length === allChapters.length) {
      await StrengthCompleted.create({
        community: group.community,
        strength: timelineStrength,
        group: group._id,
        createdBy: new mongoose.Types.ObjectId(request.user.id),
      });
    }
  }

  response.status(201).json({
    article,
    completionDate: completionDate.toJSON(),
  } satisfies CreateGroupArticleProgressResponse);
}
