import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {StrenghtPeriod, TimelineItem, Article} from '../../../models';
import {
  type UpdateStrengthPeriodParameters,
  type UpdateStrengthPeriodRequest,
  type UpdateStrengthPeriodResponse,
} from '../../client/ApiTypes';

export async function updateStrengthPeriod(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateStrengthPeriodParameters;
  const {timeline, strength} = request.body as UpdateStrengthPeriodRequest;

  const strenghtPeriod = await StrenghtPeriod.findById(id);

  if (!strenghtPeriod) {
    response.status(404).json({error: 'Strength period not found'});
    return;
  }

  if (timeline) {
    strenghtPeriod.timeline = new mongoose.Types.Array();
    strenghtPeriod.timeline.push(
      ...timeline.map((timeline) => new TimelineItem(timeline)),
    );
  }

  if (strength) {
    strenghtPeriod.strength = strength;
  }

  const articleIds = strenghtPeriod.timeline.map((item) => item.articleId);
  const articles = await Article.find({_id: {$in: articleIds}});

  const strenghtPeriodWithRootCategory = {
    _id: strenghtPeriod._id.toString(),
    strength: strenghtPeriod.strength,
    timeline: strenghtPeriod.timeline.map((item) => {
      const article = articles.find((article) =>
        article._id.equals(item.articleId),
      );
      if (!article) {
        throw new Error('Article not found');
      }

      return {
        _id: item._id.toString(),
        start: item.start.toISOString(),
        articleId: item.articleId.toString(),
        rootCategoryId: article.rootCategory.toString(),
      };
    }),
  };

  await strenghtPeriod.save();

  response.json(
    strenghtPeriodWithRootCategory satisfies UpdateStrengthPeriodResponse,
  );
}
