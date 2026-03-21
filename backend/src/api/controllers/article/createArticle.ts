import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {
  type CreateArticleRequest,
  type CreateArticleResponse,
} from '../../client/ApiTypes.js';
import {Article, ArticleCategory} from '../../../models/index.js';
import buildCategoryPath from '../article-category/buildCategoryPath.js';

export async function createArticle(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    translations,
    category,
    thumbnail,
    length,
    strengths,
    isHidden,
    isLocked,
    isTimelineArticle,
    timelineAgeGroup,
    timelineChapter,
    timelineStrength,
  } = request.body as CreateArticleRequest;

  const targetCategory = await ArticleCategory.findById(category);
  if (!targetCategory) {
    response.status(400).json({error: 'Invalid category'});
    return;
  }

  const targetGategoryArticleCount = await Article.countDocuments({
    category: targetCategory._id,
  });

  const article = new Article({
    translations,
    category,
    rootCategory: targetCategory.rootCategory,
    thumbnail,
    order: targetGategoryArticleCount,
    length,
    strengths,
    updatedBy: new mongoose.Types.ObjectId(request.user.id),
    isHidden,
    isLocked,
    isTimelineArticle,
    timelineAgeGroup,
    timelineChapter,
    timelineStrength,
  });
  await article.save();

  await article.populate({
    path: 'updatedBy',
    select: '_id firstName lastName avatar',
  });

  const categories = await ArticleCategory.find({
    rootCategory: targetCategory.rootCategory,
  });

  if (!isDocument(article.updatedBy)) {
    response.status(404).json({error: 'Updated by not found'});
    return;
  }

  response.json({
    ...article.toJSON(),
    categoryPath: buildCategoryPath(targetCategory, categories),
    category: article.category.toJSON(),
    updatedAt: article.updatedAt!.toJSON(),
    createdAt: article.createdAt!.toJSON(),
    updatedBy: article.updatedBy.toJSON(),
  } satisfies CreateArticleResponse);
}
