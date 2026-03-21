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
  Article,
} from '../../../models/index.js';
import buildCategoryPath from './buildCategoryPath.js';

async function getAllDescendantIds(
  categoryId: mongoose.Types.ObjectId,
): Promise<mongoose.Types.ObjectId[]> {
  const descendants: mongoose.Types.ObjectId[] = [];
  const queue = [categoryId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    // eslint-disable-next-line no-await-in-loop
    const children = await ArticleCategory.find({parentCategory: currentId});
    for (const child of children) {
      descendants.push(child._id);
      queue.push(child._id);
    }
  }

  return descendants;
}

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

  const parentCategoryChanged = parentCategory !== undefined;

  if (parentCategoryChanged) {
    const movingToRoot = parentCategory === null;
    const descendantIds = await getAllDescendantIds(category._id);

    if (movingToRoot) {
      if (category.parentCategory) {
        category.set('parentCategory', undefined);
        category.rootCategory = category._id;

        const rootCount = await ArticleCategory.countDocuments({
          parentCategory: null,
          _id: {$ne: category._id},
        });
        category.order = rootCount;

        if (descendantIds.length > 0) {
          await ArticleCategory.updateMany(
            {_id: {$in: descendantIds}},
            {$set: {rootCategory: category._id}},
          );
        }

        const allCategoryIds = [category._id, ...descendantIds];
        await Article.updateMany(
          {category: {$in: allCategoryIds}},
          {$set: {rootCategory: category._id}},
        );
      }
    } else {
      const newParentId = new mongoose.Types.ObjectId(parentCategory);

      if (category._id.equals(newParentId)) {
        response.status(400).json({error: 'Cannot move category under itself'});
        return;
      }

      if (
        descendantIds.some((descendantId) => descendantId.equals(newParentId))
      ) {
        response
          .status(400)
          .json({error: 'Cannot move category under its own descendant'});
        return;
      }

      const parentCategoryDocument =
        await ArticleCategory.findById(newParentId);

      if (!parentCategoryDocument) {
        response.status(400).json({error: 'Invalid parent category'});
        return;
      }

      const newRootCategory = parentCategoryDocument.rootCategory;

      category.parentCategory = parentCategoryDocument._id;
      category.rootCategory = newRootCategory;

      const siblingCount = await ArticleCategory.countDocuments({
        parentCategory: parentCategoryDocument._id,
        _id: {$ne: category._id},
      });
      category.order = siblingCount;

      if (descendantIds.length > 0) {
        await ArticleCategory.updateMany(
          {_id: {$in: descendantIds}},
          {$set: {rootCategory: newRootCategory}},
        );
      }

      const allCategoryIds = [category._id, ...descendantIds];
      await Article.updateMany(
        {category: {$in: allCategoryIds}},
        {$set: {rootCategory: newRootCategory}},
      );
    }
  }

  if (translations) {
    category.set(
      'translations',
      translations.map(
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

  response.status(200).json({
    ...category.toJSON(),
    parentCategory: category.parentCategory?.toJSON(),
    subCategories: [],
    articles: [],
    categoryPath: buildCategoryPath(category, categories),
  } satisfies UpdateArticleCategoryResponse);
}
