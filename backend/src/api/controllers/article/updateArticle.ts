import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {
  type UpdateArticleRequest,
  type UpdateArticleResponse,
} from '../../client/ApiTypes.js';
import {Article, ArticleCategory} from '../../../models/index.js';
import buildCategoryPath from '../article-category/buildCategoryPath.js';

export async function updateArticle(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as {id: string};

  const article = await Article.findById(id);
  if (!article) {
    response.status(404).json({error: 'Article not found'});
    return;
  }

  const {
    translations,
    category,
    thumbnail,
    length,
    strengths,
    isHidden,
    isLocked,
    changeLog,
    isTimelineArticle,
    timelineAgeGroup,
    timelineChapter,
    timelineStrength,
  } = request.body as UpdateArticleRequest;

  if (translations) {
    article.set('translations', translations);
  }

  const targetCategory = category
    ? await ArticleCategory.findById(category)
    : await ArticleCategory.findById(article.category);

  if (!targetCategory) {
    response.status(400).json({error: 'Invalid category'});
    return;
  }

  if (category) {
    article.category = targetCategory._id;
    article.rootCategory = targetCategory.rootCategory;
  }

  if (thumbnail) {
    article.thumbnail = thumbnail;
  }

  if (length) {
    article.length = length;
  }

  if (strengths) {
    article.set('strengths', strengths);
  }

  if (isHidden !== undefined) {
    article.isHidden = isHidden;
  }

  if (isLocked !== undefined) {
    article.isLocked = isLocked;
  }

  if (isTimelineArticle !== undefined) {
    article.isTimelineArticle = isTimelineArticle;
  }

  if (timelineAgeGroup) {
    article.timelineAgeGroup = timelineAgeGroup;
  }

  if (timelineChapter) {
    article.timelineChapter = timelineChapter;
  }

  if (timelineStrength) {
    article.timelineStrength = timelineStrength;
  }

  article.updatedBy = new mongoose.Types.ObjectId(request.user.id);

  await article.save();

  await article.populate({
    path: 'updatedBy',
    select: '_id firstName lastName avatar',
  });

  if (!isDocument(article.updatedBy)) {
    response.status(404).json({error: 'Updated by not found'});
    return;
  }

  await article.saveHistory(changeLog);

  const categories = await ArticleCategory.find({
    rootCategory: article.rootCategory,
  });

  response.json({
    ...article.toJSON(),
    updatedBy: request.user,
    updatedAt: article.updatedAt!.toJSON(),
    createdAt: article.createdAt!.toJSON(),
    category: article.category.toJSON(),
    categoryPath: buildCategoryPath(targetCategory, categories),
  } satisfies UpdateArticleResponse);
}
