import {type DocumentType} from '@typegoose/typegoose';
import {type ArticleCategory as ArticleCategoryModel} from '../../../models/ArticleCategory';

const buildCategoryPath = (
  category: DocumentType<ArticleCategoryModel>,
  categories: Array<DocumentType<ArticleCategoryModel>>,
): Array<{
  _id: string;
  translations: Array<{language: string; name: string}>;
}> => {
  const path = [];
  let currentCategory = category;

  path.unshift({
    _id: currentCategory._id.toString(),
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
      _id: parentCategory._id.toString(),
      translations: parentCategory.translations,
    });
    currentCategory = parentCategory;
  }

  return path;
};

export default buildCategoryPath;
