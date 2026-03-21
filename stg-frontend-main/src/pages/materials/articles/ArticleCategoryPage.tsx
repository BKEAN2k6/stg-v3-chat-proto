import {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {useParams, useSearchParams} from 'react-router-dom';
import {Breadcrumb, Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useTracking} from 'react-tracking';
import ArticleCategoryListView from './ArticleCategoryListView';
import ArticleCategoryGridView from './ArticleCategoryGridView';
import type LocalicedArticleCategory from './LocalicedArticleCategory';
import {type StrengthSlug, type ArticleCategory} from '@/api/ApiTypes';
import LanguagePicker from '@/components/ui/LanguagePicker';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {useTitle} from '@/context/pageTitleContext';
import {type LanguageCode} from '@/i18n';
import {useCurrentUser} from '@/context/currentUserContext';

function filterByLanguage(
  category: ArticleCategory,
  language: string,
): LocalicedArticleCategory | undefined {
  const translations = category.translations;
  const translation = translations.find(
    (translation) => translation.language === language,
  );

  if (!translation) {
    return undefined;
  }

  return {
    _id: category._id,
    name: translation.name,
    description: translation.description,
    subCategories: category.subCategories
      .sort((a, b) => a.order - b.order)
      .map((subCategory) => filterByLanguage(subCategory, language))
      .filter(Boolean) as LocalicedArticleCategory[],
    thumbnail: category.thumbnail,
    displayAs: category.displayAs,
    isLocked: category.isLocked,
    articles: category.articles
      .sort((a, b) => a.order - b.order)
      .map(({translations, _id, thumbnail, length, strengths, isLocked}) => {
        const articleTranslation = translations.find(
          (translation) => translation.language === language,
        );

        if (!articleTranslation) {
          return null;
        }

        const {title, description} = articleTranslation;

        return {
          _id,
          title,
          description,
          thumbnail,
          length,
          strengths,
          isLocked,
        };
      })
      .filter(Boolean) as Array<{
      _id: string;
      title: string;
      description: string;
      thumbnail: string;
      length: string;
      strengths: StrengthSlug[];
      isLocked: boolean;
    }>,

    categoryPath: category.categoryPath.map((pathCategory) => ({
      _id: pathCategory._id,
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
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>();
  const {trackEvent} = useTracking<Trackables>({
    page: 'article-gategory',
    path: window.location.pathname,
  });
  const {setTitle} = useTitle();
  const {i18n} = useLingui();
  const {categoryId} = useParams();
  const [category, setCategory] = useState<ArticleCategory>();

  const toasts = useToasts();

  useEffect(() => {
    if (!category) {
      return;
    }

    const lang = searchParameters.get('lang') as LanguageCode;
    const availableLanguages = category.translations.map(
      (translation) => translation.language,
    );

    let selectedLanguage;

    if (lang && availableLanguages.includes(lang)) {
      selectedLanguage = lang;
    } else if (availableLanguages.includes(i18n.locale as LanguageCode)) {
      selectedLanguage = i18n.locale;
    } else {
      selectedLanguage = availableLanguages[0];
    }

    setSelectedLanguage(selectedLanguage as LanguageCode);
  }, [category, i18n.locale, searchParameters, setSelectedLanguage, i18n]);

  useEffect(() => {
    if (!category || !selectedLanguage) {
      return;
    }

    const filteredCategory = filterByLanguage(category, selectedLanguage);

    if (!filteredCategory) {
      return;
    }

    setTitle(filteredCategory.name);
  }, [setTitle, category, selectedLanguage]);

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const getCategory = async () => {
      try {
        const category = await api.getArticleCategory({id: categoryId});
        setCategory(category);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong getting the material',
        });
      }
    };

    void getCategory();
  }, [categoryId, toasts]);

  if (!category || !selectedLanguage) {
    return null;
  }

  const filteredCategory = filterByLanguage(category, selectedLanguage);

  if (!filteredCategory) {
    return null;
  }

  trackEvent({
    action: 'page-view',
    language: selectedLanguage,
  });

  return (
    <div>
      <Breadcrumb>
        {category.categoryPath.map((pathCategory, index) => {
          return (
            <LinkContainer
              key={pathCategory._id}
              to={{
                pathname:
                  category.categoryPath[0]._id === pathCategory._id
                    ? `/article-categories/${pathCategory._id}`
                    : `/article-categories/${category.categoryPath[0]._id}/category/${pathCategory._id}`,
                search: `?lang=${selectedLanguage}`,
              }}
            >
              <Breadcrumb.Item
                key={pathCategory._id}
                active={index === category.categoryPath.length - 1}
              >
                {pathCategory.translations.find(
                  (translation) => translation.language === selectedLanguage,
                )?.name ?? pathCategory.translations[0].name}
              </Breadcrumb.Item>
            </LinkContainer>
          );
        })}
      </Breadcrumb>
      <div className="d-flex justify-content-between mb-3">
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
        {isSuperAdmin && (
          <LinkContainer to={`/article-categories/${category._id}/edit`}>
            <Button variant="primary">Edit</Button>
          </LinkContainer>
        )}
      </div>
      <div className="mb-4">
        <h2>{filteredCategory.name}</h2>
        <hr
          style={{
            margin: '0',
            marginBottom: '1rem',
          }}
        />
        <p>{filteredCategory.description}</p>
      </div>

      {renderCategory(filteredCategory, selectedLanguage)}
    </div>
  );
}
