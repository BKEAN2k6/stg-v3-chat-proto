import {Trans} from '@lingui/react/macro';
import {type LanguageCode} from '@client/ApiTypes';
import ArticleCard from '../components/ArticleCard.js';
import type LocalicedArticleCategory from './LocalicedArticleCategory.js';
import ArticleCategoryCard from './ArticleCategoryCard.js';

type Properties = {
  readonly category: LocalicedArticleCategory;
  readonly languageCode: LanguageCode;
};

export default function ArticleCategoryGridView(properties: Properties) {
  const {category, languageCode} = properties;

  return (
    <div>
      {category.articles.length > 0 && (
        <div className="card-container mb-3">
          {category.articles.map(
            ({
              id,
              title,
              thumbnail,
              length,
              strengths,
              description,
              isLocked,
            }) => (
              <ArticleCard
                key={id}
                id={id}
                title={title}
                description={description}
                length={length}
                strengths={strengths}
                thumbnail={thumbnail}
                languageCode={languageCode}
                rootCategoryId={category.categoryPath[0].id}
                isLocked={isLocked}
              />
            ),
          )}
        </div>
      )}
      {category.articles.length > 0 && category.subCategories.length > 0 && (
        <div className="mt-4">
          <h4>
            <Trans>Additional materials</Trans>
          </h4>
        </div>
      )}
      <div className="card-container">
        {category.subCategories.map(({id, name, thumbnail, isLocked}) => (
          <ArticleCategoryCard
            key={id}
            id={id}
            name={name}
            languageCode={languageCode}
            thumbnail={thumbnail}
            rootCategoryId={category.categoryPath[0].id}
            isLocked={isLocked}
          />
        ))}
      </div>
    </div>
  );
}
