import type mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {type ArticleCategory as ArticleCategoryModel} from '../../../models/ArticleCategory.js';
import {type Article as ArticleModel} from '../../../models/Article.js';
import {type ArticleCategoryListItem} from '../../client/ApiTypes.js';

const buildCategoryTree = (
  categories: Array<DocumentType<ArticleCategoryModel>>,
  articles: Array<DocumentType<ArticleModel>>,
  parentId: mongoose.Types.ObjectId,
): ArticleCategoryListItem[] => {
  const subCategories = categories.filter((category) =>
    category.parentCategory?.equals(parentId),
  );

  return subCategories.map((category) => ({
    ...category.toJSON(),
    rootCategory: category.rootCategory.toJSON(),
    parentCategory: category.parentCategory.toJSON(),
    subCategories: buildCategoryTree(categories, articles, category._id),
    articles: articles
      .filter((article) => article.category.equals(category._id))
      .map((article) => {
        return {
          ...article.toJSON(),
          category: article.category.toJSON(),
          rootCategory: article.rootCategory.toJSON(),
        };
      }),
  }));
};

export {buildCategoryTree};
