import {type Request, type Response} from 'express';
import {StrenghtPeriod, Article} from '../../../models';
import {
  type CreateStrengthPeriodRequest,
  type CreateStrengthPeriodResponse,
} from '../../client/ApiTypes';

export async function createStrengthPeriod(
  request: Request,
  response: Response,
): Promise<void> {
  const {timeline, strength} = request.body as CreateStrengthPeriodRequest;

  const strenghtPeriod = new StrenghtPeriod({
    timeline: timeline.map((item) => ({
      articleId: item.articleId,
      start: new Date(item.start),
    })),
    strength,
  });

  const articleIds = timeline.map((item) => item.articleId);
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
    strenghtPeriodWithRootCategory satisfies CreateStrengthPeriodResponse,
  );
}
