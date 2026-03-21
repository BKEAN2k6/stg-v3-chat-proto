import {type DocumentType} from '@typegoose/typegoose';
import {type ArticleCategory as ArticleCategoryModel} from '../../../models/ArticleCategory.js';
import {type LanguageCode} from '../../client/ApiTypes.js';

const buildCategoryPath = (
  category: DocumentType<ArticleCategoryModel>,
  categories: Array<DocumentType<ArticleCategoryModel>>,
): Array<{
  id: string;
  translations: Array<{language: LanguageCode; name: string}>;
}> => {
  const path = [];
  let currentCategory = category;

  path.unshift({
    id: currentCategory._id.toString(),
    translations: currentCategory.translations,
  });

  while (currentCategory.parentCategory) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    const parentCategory = categories.find((cat) =>
      cat._id.equals(currentCategory.parentCategory?._id),
    );

    if (!parentCategory) {
      break;
    }

    path.unshift({
      id: parentCategory._id.toString(),
      translations: parentCategory.translations,
    });
    currentCategory = parentCategory;
  }

  return path;
};

export default buildCategoryPath;
