import {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Trans} from '@lingui/react/macro';
import {useParams, useSearchParams} from 'react-router-dom';
import {Breadcrumb, Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {
  type StrengthSlug,
  type ArticleCategory,
  type LanguageCode,
} from '@client/ApiTypes';
import {useGetArticleCategoryQuery} from '@client/ApiHooks.js';
import ArticleCategoryListView from './ArticleCategoryListView.js';
import ArticleCategoryGridView from './ArticleCategoryGridView.js';
import type LocalicedArticleCategory from './LocalicedArticleCategory.js';
import LanguagePicker from '@/components/ui/LanguagePicker.js';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import CenteredLoader from '@/components/CenteredLoader.js';
import PageTitle from '@/components/ui/PageTitle.js';

function filterByLanguage(
  category: ArticleCategory,
  language: string,
): LocalicedArticleCategory | undefined {
  const {translations} = category;
  const translation = translations.find(
    (translation) => translation.language === language,
  );

  if (!translation) {
    return undefined;
  }

  return {
    id: category.id,
    name: translation.name,
    description: translation.description,
    subCategories: category.subCategories
      .sort((a, b) => a.order - b.order)
      .map((subCategory) => filterByLanguage(subCategory, language))
      .filter(Boolean) as LocalicedArticleCategory[],
    thumbnail: translation.thumbnail ?? category.thumbnail,
    displayAs: category.displayAs,
    isLocked: category.isLocked,
    articles: category.articles
      .sort((a, b) => a.order - b.order)
      .map(({translations, id, thumbnail, length, strengths, isLocked}) => {
        const articleTranslation = translations.find(
          (translation) => translation.language === language,
        );

        if (!articleTranslation) {
          return null;
        }

        const {
          title,
          description,
          thumbnail: translationThumbnail,
        } = articleTranslation;

        return {
          id,
          title,
          description,
          thumbnail: translationThumbnail ?? thumbnail,
          length,
          strengths,
          isLocked,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      length: string;
      strengths: StrengthSlug[];
      isLocked: boolean;
    }>,
    categoryPath: category.categoryPath.map((pathCategory) => ({
      id: pathCategory.id,
      name:
        pathCategory.translations.find(
          (translation) => translation.language === language,
        )?.name ?? pathCategory.translations[0].name,
    })),
  };
}

const renderCategory = (
  category: LocalicedArticleCategory,
  languageCode: LanguageCode,
) => {
  if (category.displayAs === 'list') {
    return (
      <ArticleCategoryListView
        category={category}
        languageCode={languageCode}
      />
    );
  }

  if (category.displayAs === 'grid') {
    return (
      <ArticleCategoryGridView
        category={category}
        languageCode={languageCode}
      />
    );
  }

  return null;
};

export default function ArticleCategoryPage() {
  const {isSuperAdmin} = useCurrentUser();
  const {activeGroup} = useActiveGroup();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>();
  const {i18n} = useLingui();
  const {categoryId} = useParams();
  const toasts = useToasts();

  const {
    data: category,
    isLoading,
    error,
  } = useGetArticleCategoryQuery(
    {id: categoryId!},
    {enabled: Boolean(categoryId)},
  );

  useEffect(() => {
    if (!category) return;

    const lang = searchParameters.get('lang') as LanguageCode;
    const availableLanguages = category.translations.map(
      (translation) => translation.language,
    );

    let selected: LanguageCode;
    if (lang && availableLanguages.includes(lang)) {
      selected = lang;
    } else if (
      activeGroup?.language &&
      availableLanguages.includes(activeGroup.language)
    ) {
      selected = activeGroup.language;
    } else if (availableLanguages.includes(i18n.locale as LanguageCode)) {
      selected = i18n.locale as LanguageCode;
    } else if (availableLanguages.length > 0) {
      selected = availableLanguages[0];
    } else {
      selected = i18n.locale as LanguageCode;
    }

    setSelectedLanguage(selected);
  }, [category, i18n.locale, searchParameters, activeGroup?.language]);

  useEffect(() => {
    if (error) {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong getting the material',
      });
    }
  }, [error, toasts]);

  if (isLoading || !category || !selectedLanguage) {
    return <CenteredLoader />;
  }

  const filteredCategory = filterByLanguage(category, selectedLanguage);
  if (!filteredCategory)
    return (
      <Trans>
        <p>Category not available in this language.</p>
      </Trans>
    );

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <PageTitle title={filteredCategory.name}>
          <div className="d-flex justify-content-between gap-1">
            <LanguagePicker
              currentLanguage={selectedLanguage}
              availableLanguages={category.translations.map(
                (translation) => translation.language,
              )}
              onChangeLanguage={(locale) => {
                searchParameters.set('lang', locale);
                setSearchParameters(searchParameters);
              }}
            />
            {isSuperAdmin ? (
              <LinkContainer to={`/article-categories/${category.id}/edit`}>
                <Button variant="primary">Edit</Button>
              </LinkContainer>
            ) : null}
          </div>
        </PageTitle>
        {category.categoryPath.length > 1 && (
          <Breadcrumb className="mt-2">
            {category.categoryPath.map((pathCategory, index) => (
              <LinkContainer
                key={pathCategory.id}
                to={{
                  pathname:
                    category.categoryPath[0].id === pathCategory.id
                      ? `/article-categories/${pathCategory.id}`
                      : `/article-categories/${category.categoryPath[0].id}/category/${pathCategory.id}`,
                  search: `?lang=${selectedLanguage}`,
                }}
              >
                <Breadcrumb.Item
                  active={index === category.categoryPath.length - 1}
                >
                  {pathCategory.translations.find(
                    (translation) => translation.language === selectedLanguage,
                  )?.name ?? pathCategory.translations[0].name}
                </Breadcrumb.Item>
              </LinkContainer>
            ))}
          </Breadcrumb>
        )}
      </div>
      <p className="mb-0">{filteredCategory.description}</p>
      {renderCategory(filteredCategory, selectedLanguage)}
    </div>
  );
}
