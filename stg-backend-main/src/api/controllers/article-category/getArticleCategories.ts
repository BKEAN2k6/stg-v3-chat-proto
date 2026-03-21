import {type Request, type Response} from 'express';
import {ArticleCategory, Article} from '../../../models';
import {buildCategoryTree} from './buildCategoryTree';

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

  const categoryTree = rootCategories.map((category) => ({
    ...category.toJSON(),
    subCategories: buildCategoryTree(categories, articles, category._id),
    articles: articles
      .filter((article) => article.category.equals(category._id))
      .map((article) => article.toJSON()),
  }));

  response.json(categoryTree);
};
