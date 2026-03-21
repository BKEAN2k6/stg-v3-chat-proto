import {type Request, type Response} from 'express';
import {
  type CreateArticleCategoryRequest,
  type CreateArticleCategoryResponse,
} from '../../client/ApiTypes.js';
import {ArticleCategory} from '../../../models/index.js';
import buildCategoryPath from './buildCategoryPath.js';

export async function createArticleCategory(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    translations,
    parentCategory,
    displayAs,
    thumbnail,
    isHidden,
    isLocked,
  } = request.body as CreateArticleCategoryRequest;

  let parentCategoryDocument;
  let parentCategorySubCategoryCount = 0;
  if (parentCategory) {
    parentCategoryDocument = await ArticleCategory.findById(parentCategory);

    if (!parentCategoryDocument) {
      response.status(400).json({error: 'Invalid parent category'});
      return;
    }

    parentCategorySubCategoryCount = await ArticleCategory.countDocuments({
      parentCategory: parentCategoryDocument._id,
    });
  } else {
    parentCategorySubCategoryCount = await ArticleCategory.countDocuments({
      parentCategory: null,
    });
  }

  const category = new ArticleCategory({
    translations,
    order: parentCategorySubCategoryCount,
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
