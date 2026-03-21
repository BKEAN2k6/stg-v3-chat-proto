import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  type CreateArticleRequest,
  type CreateArticleResponse,
} from '../../client/ApiTypes';
import {Article, ArticleCategory} from '../../../models';
import buildCategoryPath from '../article-category/buildCategoryPath';

export async function createArticle(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    translations,
    category,
    thumbnail,
    order,
    length,
    strengths,
    isHidden,
    isLocked,
  } = request.body as CreateArticleRequest;

  const targetCategory = await ArticleCategory.findById(category);
  if (!targetCategory) {
    response.status(400).json({error: 'Invalid category'});
    return;
  }

  const article = new Article({
    translations,
    category,
    rootCategory: targetCategory.rootCategory,
    thumbnail,
    order,
    length,
    strengths,
    updatedBy: new mongoose.Types.ObjectId(request.user.id),
    isHidden,
    isLocked,
  });
  await article.save();

  await article.populate({
    path: 'updatedBy',
    select: '_id firstName lastName avatar',
  });

  const categories = await ArticleCategory.find({
    rootCategory: targetCategory.rootCategory,
  });

  response.json({
    ...article.toJSON(),
    categoryPath: buildCategoryPath(targetCategory, categories),
  } satisfies CreateArticleResponse);
}
