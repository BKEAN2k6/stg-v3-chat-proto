import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  type StrengthSlug,
  type UpdateArticleRequest,
  type UpdateArticleResponse,
} from '../../client/ApiTypes';
import {Article, ArticleTranslation, ArticleCategory} from '../../../models';
import buildCategoryPath from '../article-category/buildCategoryPath';

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
    order,
    length,
    strengths,
    isHidden,
    isLocked,
  } = request.body as UpdateArticleRequest;

  if (translations) {
    article.translations = new mongoose.Types.Array();
    article.translations.push(
      ...translations.map((translation) => new ArticleTranslation(translation)),
    );
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

  if (order) {
    article.order = order;
  }

  if (length) {
    article.length = length;
  }

  if (strengths) {
    article.strengths = strengths as mongoose.Types.Array<StrengthSlug>;
  }

  if (isHidden !== undefined) {
    article.isHidden = isHidden;
  }

  if (isLocked !== undefined) {
    article.isLocked = isLocked;
  }

  article.updatedBy = new mongoose.Types.ObjectId(request.user.id);

  await article.save();

  await article.populate({
    path: 'updatedBy',
    select: '_id firstName lastName avatar',
  });

  const categories = await ArticleCategory.find({
    rootCategory: article.rootCategory,
  });

  response.json({
    ...article.toJSON(),
    categoryPath: buildCategoryPath(targetCategory, categories),
  } satisfies UpdateArticleResponse);
}
