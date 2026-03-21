import {type Request, type Response} from 'express';
import {ArticleCategory, Article} from '../../../models/index.js';
import {type GetArticleCategoriesResponse} from '../../client/ApiTypes.js';
import {buildCategoryTree} from './buildCategoryTree.js';

export const getArticleCategories = async function (
  request: Request,
  response: Response,
): Promise<void> {
  const categories = await ArticleCategory.find();
  const articles = await Article.find({
    category: {$in: categories.map((category) => category._id)},
  });

  const rootCategories = categories.filter(
    (category) => !category.parentCategory,
  );

  const categoryTree: GetArticleCategoriesResponse = rootCategories.map(
    (category) => ({
      ...category.toJSON(),
      rootCategory: category.rootCategory?.toJSON(),
      parentCategory: category.parentCategory?.toJSON(),
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
    }),
  );

  response.json(categoryTree satisfies GetArticleCategoriesResponse);
};
