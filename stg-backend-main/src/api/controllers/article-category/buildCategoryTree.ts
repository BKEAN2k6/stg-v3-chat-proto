import type mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {type ArticleCategory as ArticleCategoryModel} from '../../../models/ArticleCategory';
import {type Article as ArticleModel} from '../../../models/Article';
import {type ArticleCategoryListItem} from '../../client/ApiTypes';

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
    subCategories: buildCategoryTree(categories, articles, category._id),
    articles: articles
      .filter((article) => article.category.equals(category._id))
      .map((article) => article.toJSON()),
  }));
};

export {buildCategoryTree};
