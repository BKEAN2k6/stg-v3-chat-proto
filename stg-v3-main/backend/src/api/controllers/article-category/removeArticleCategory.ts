import {type Request, type Response} from 'express';
import {ArticleCategory, Article} from '../../../models/index.js';

export const removeArticleCategory = async function (
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;

  const category = await ArticleCategory.findById(id);

  if (!category) {
    response.status(404).json({error: 'Category not found'});
    return;
  }

  const categories = await ArticleCategory.find({
    $or: [{parentCategory: category._id}, {rootCategory: category._id}],
  });

  if (
    categories.length > 1 ||
    (categories.length === 1 &&
      !categories[0].rootCategory.equals(category._id))
  ) {
    response.status(400).json({error: 'Category has subcategories'});
    return;
  }

  const articles = await Article.find({
    $or: [{category: category._id}, {rootCategory: category._id}],
  });

  if (articles.length > 0) {
    response.status(400).json({error: 'Category has articles'});
    return;
  }

  await category.deleteOne();

  response.sendStatus(204);
};
