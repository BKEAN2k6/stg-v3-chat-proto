import {type Request, type Response} from 'express';
import {type DocumentType} from '@typegoose/typegoose';
import {ArticleCategory, Article} from '../../../models/index.js';
import {type ArticleCategory as ArticleCategoryModel} from '../../../models/ArticleCategory.js';
import {type Article as ArticleModel} from '../../../models/Article.js';
import {type GetArticleCategoryResponse} from '../../client/ApiTypes.js';
import buildCategoryPath from './buildCategoryPath.js';

const buildArticleCategoryResponse = (
  category: DocumentType<ArticleCategoryModel>,
  allCategories: Array<DocumentType<ArticleCategoryModel>>,
  allArticles: Array<DocumentType<ArticleModel>>,
): GetArticleCategoryResponse => {
  const subCategories = allCategories
    .filter((cat) => cat.parentCategory?._id.equals(category._id))
    .map((cat) =>
      buildArticleCategoryResponse(cat, allCategories, allArticles),
    );

  const articles = allArticles
    .filter((article) => article.category._id.equals(category._id))
    .map((article) => ({
      id: article._id.toString(),
      translations: article.translations,
      tags: article.tags,
      thumbnail: article.thumbnail,
      order: article.order,
      length: article.length,
      strengths: article.strengths,
      isHidden: article.isHidden,
      isLocked: article.isLocked,
    }));

  return {
    id: category._id.toString(),
    translations: category.translations,
    subCategories,
    articles,
    order: category.order,
    categoryPath: [],
    thumbnail: category.thumbnail,
    displayAs: category.displayAs,
    isHidden: category.isHidden,
    isLocked: category.isLocked,
  };
};

export const getArticleCategory = async function (
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;

  const category = await ArticleCategory.findById(id);

  if (!category) {
    response.status(404).json({error: 'Category not found'});
    return;
  }

  const isGridDisplay = category.displayAs === 'grid';

  const categories = await ArticleCategory.find({
    rootCategory: category.rootCategory,
    isHidden: false,
  });

  const articles = await Article.find({
    isHidden: false,
    ...(isGridDisplay
      ? {category: category._id}
      : {rootCategory: category.rootCategory}),
  });

  const responseCategory = buildArticleCategoryResponse(
    category,
    isGridDisplay
      ? categories.filter(
          (cat) =>
            cat.parentCategory?._id.equals(category._id) ||
            cat._id.equals(category._id),
        )
      : categories,
    articles,
  );

  responseCategory.categoryPath = buildCategoryPath(category, categories);

  response.json(responseCategory satisfies GetArticleCategoryResponse);
};
