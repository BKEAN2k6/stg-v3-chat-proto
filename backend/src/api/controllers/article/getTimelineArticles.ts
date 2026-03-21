import {type Request, type Response} from 'express';
import {Article} from '../../../models/index.js';
import {type GetTimelineArticlesResponse} from '../../client/ApiTypes.js';

export async function getTimelineArticles(
  _request: Request,
  response: Response,
): Promise<void> {
  const timelineArticles = await Article.find({
    isTimelineArticle: true,
    isHidden: false,
    isLocked: false,
  }).select('_id timelineChapter timelineAgeGroup timelineStrength');

  const mappedArticles = timelineArticles.map((article) => ({
    id: article._id.toJSON(),
    chapter: article.timelineChapter,
    ageGroup: article.timelineAgeGroup,
    strength: article.timelineStrength,
  }));

  response.json(mappedArticles satisfies GetTimelineArticlesResponse);
}
