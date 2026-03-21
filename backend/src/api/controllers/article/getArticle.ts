import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Article, ArticleCategory} from '../../../models/index.js';
import {
  type GetArticleResponse,
  type GetArticleParameters,
} from '../../client/ApiTypes.js';
import buildCategoryPath from '../article-category/buildCategoryPath.js';

export async function getArticle(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetArticleParameters;

  const article = await Article.findById(id).populate({
    path: 'updatedBy',
    select: '_id firstName lastName avatar',
  });

  if (!article) {
    response.status(404).json({error: 'Article not found'});
    return;
  }

  const categories = await ArticleCategory.find({
    rootCategory: article.rootCategory,
  });

  const category = categories.find((cat) => cat._id.equals(article.category));
  if (!category) {
    response.status(404).json({error: 'Category not found'});
    return;
  }

  const pathCategories = categories.filter((cat) => !cat.isHidden);

  if (!isDocument(article.updatedBy)) {
    response.status(404).json({error: 'Updated by not found'});
    return;
  }

  response.json({
    ...article.toJSON(),
    updatedBy: article.updatedBy.toJSON(),
    updatedAt: article.updatedAt!.toJSON(),
    createdAt: article.createdAt!.toJSON(),
    category: category._id.toJSON(),
    categoryPath: buildCategoryPath(category, pathCategories),
  } satisfies GetArticleResponse);
}
