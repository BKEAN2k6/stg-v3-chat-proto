import {type Request, type Response} from 'express';
import {
  type CreateArticleCategoryRequest,
  type CreateArticleCategoryResponse,
} from '../../client/ApiTypes';
import {ArticleCategory} from '../../../models';
import buildCategoryPath from './buildCategoryPath';

export async function createArticleCategory(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    translations,
    order,
    parentCategory,
    displayAs,
    thumbnail,
    isHidden,
    isLocked,
  } = request.body as CreateArticleCategoryRequest;

  let parentCategoryDocument;
  if (parentCategory) {
    parentCategoryDocument = await ArticleCategory.findById(parentCategory);

    if (!parentCategoryDocument) {
      response.status(400).json({error: 'Invalid parent category'});
      return;
    }
  }

  const category = new ArticleCategory({
    translations,
    order,
    thumbnail,
    displayAs,
    parentCategory: parentCategoryDocument?._id,
    isHidden,
    isLocked,
  });

  category.rootCategory = parentCategoryDocument
    ? parentCategoryDocument.rootCategory
    : category._id;

  await category.save();

  const categories = await ArticleCategory.find({
    rootCategory: category.rootCategory,
  });

  response.status(201).json({
    ...category.toJSON(),
    subCategories: [],
    articles: [],
    categoryPath: buildCategoryPath(category, categories),
  } satisfies CreateArticleCategoryResponse);
}
