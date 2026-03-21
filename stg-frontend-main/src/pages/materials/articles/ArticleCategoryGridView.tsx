import type LocalicedArticleCategory from './LocalicedArticleCategory';
import ArticleCategoryCard from './ArticleCategoryCard';
import ArticleCard from './ArticleCard';
import {type LanguageCode} from '@/i18n';

type Props = {
  readonly category: LocalicedArticleCategory;
  readonly languageCode: LanguageCode;
};

export default function ArticleCategoryGridView(props: Props) {
  const {category, languageCode} = props;

  return (
    <>
      <div className="d-flex flex-wrap gap-3">
        {category.subCategories.map(({_id, name, thumbnail, isLocked}) => (
          <ArticleCategoryCard
            key={_id}
            id={_id}
            name={name}
            languageCode={languageCode}
            thumbnail={thumbnail}
            rootCategoryId={category.categoryPath[0]._id}
            isLocked={isLocked}
          />
        ))}
      </div>
      <div className="d-flex flex-wrap gap-3">
        {category.articles.map(
          ({
            _id,
            title,
            thumbnail,
            length,
            strengths,
            description,
            isLocked,
          }) => (
            <ArticleCard
              key={_id}
              id={_id}
              title={title}
              description={description}
              length={length}
              strengths={strengths}
              thumbnail={thumbnail}
              languageCode={languageCode}
              rootCategoryId={category.categoryPath[0]._id}
              isLocked={isLocked}
            />
          ),
        )}
      </div>
    </>
  );
}
