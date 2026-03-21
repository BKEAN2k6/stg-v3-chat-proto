import type mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {StrenghtPeriod, Article} from '../../../models';
import {type GetStrengthPeriodsResponse} from '../../client/ApiTypes';

export async function getStrengthPeriods(
  request: Request,
  response: Response,
): Promise<void> {
  const strengthPeriods = await StrenghtPeriod.find();
  const articleIds: mongoose.Types.ObjectId[] = [];

  for (const strengthPeriod of strengthPeriods) {
    for (const timelineItem of strengthPeriod.timeline) {
      articleIds.push(timelineItem.articleId);
    }
  }

  const articles = await Article.find({_id: {$in: articleIds}}).select(
    '_id rootCategory',
  );
  const strenghtPeriodsWithRootCategory = strengthPeriods.map(
    (strengthPeriod) => {
      const {_id, strength, timeline} = strengthPeriod;
      return {
        _id: _id.toString(),
        strength,
        timeline: timeline.map((timelineItem) => {
          const {_id, start, articleId} = timelineItem;
          const article = articles.find((article) =>
            article._id.equals(timelineItem.articleId),
          );
          if (!article) {
            throw new Error('Article not found');
          }

          return {
            _id: _id.toString(),
            start: start.toISOString(),
            articleId: articleId.toString(),
            rootCategoryId: article.rootCategory.toString(),
          };
        }),
      };
    },
  );

  response.json(
    strenghtPeriodsWithRootCategory satisfies GetStrengthPeriodsResponse,
  );
}
