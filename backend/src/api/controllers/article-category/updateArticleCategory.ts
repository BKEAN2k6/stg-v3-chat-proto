import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  type UpdateArticleCategoryRequest,
  type UpdateArticleCategoryResponse,
  type UpdateArticleCategoryParameters,
} from '../../client/ApiTypes.js';
import {
  ArticleCategory,
  ArticleCategoryTranslation,
} from '../../../models/index.js';
import buildCategoryPath from './buildCategoryPath.js';

export async function updateArticleCategory(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateArticleCategoryParameters;
  const {
    translations,
    parentCategory,
    thumbnail,
    displayAs,
    isHidden,
    isLocked,
  } = request.body as UpdateArticleCategoryRequest;

  const category = await ArticleCategory.findById(id);

  if (!category) {
    response.status(404).json({error: 'Category not found'});
    return;
  }

  let parentCategoryDocument;
  if (parentCategory) {
    parentCategoryDocument = await ArticleCategory.findById(parentCategory);

    if (!parentCategoryDocument) {
      response.status(400).json({error: 'Invalid parent category'});
      return;
    }

    category.parentCategory = parentCategoryDocument._id;
    category.rootCategory = parentCategoryDocument.rootCategory;
  }

  if (translations) {
    category.translations = new mongoose.Types.Array();

    category.translations.push(
      ...translations.map(
        (translation) => new ArticleCategoryTranslation(translation),
      ),
    );
  }

  if (thumbnail) {
    category.thumbnail = thumbnail;
  }

  if (displayAs) {
    category.displayAs = displayAs;
  }

  if (isHidden !== undefined) {
    category.isHidden = isHidden;
  }

  if (isLocked !== undefined) {
    category.isLocked = isLocked;
  }

  await category.save();

  const categories = await ArticleCategory.find({
    rootCategory: category.rootCategory,
  });

  response.status(201).json({
    ...category.toJSON(),
    subCategories: [],
    articles: [],
    categoryPath: buildCategoryPath(category, categories),
  } satisfies UpdateArticleCategoryResponse);
}
