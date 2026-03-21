import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {useLingui} from '@lingui/react';
import {Breadcrumb, Button} from 'react-bootstrap';
import {useTracking} from 'react-tracking';
import ArticleView from './ArticleView';
import {useTitle} from '@/context/pageTitleContext';
import {type LanguageCode} from '@/i18n';
import {useToasts} from '@/components/toasts';
import {type Article} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import LanguagePicker from '@/components/ui/LanguagePicker';
import {useCurrentUser} from '@/context/currentUserContext';

export default function ArticlePage() {
  const {isSuperAdmin} = useCurrentUser();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>();
  const {articleId} = useParams();
  const [article, setArticle] = useState<Article>();
  const toasts = useToasts();
  const {setTitle} = useTitle();
  const {i18n} = useLingui();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const {Track, trackEvent} = useTracking<Trackables>({
    page: 'article',
    path: window.location.pathname,
  });

  useEffect(() => {
    if (!article) {
      return;
    }

    const lang = searchParameters.get('lang') as LanguageCode;

    const availableLanguages = article.translations.map(
      (translation) => translation.language,
    );

    // Determine the language to set
    let selectedLanguage;

    if (lang && availableLanguages.includes(lang)) {
      selectedLanguage = lang;
    } else if (availableLanguages.includes(i18n.locale as LanguageCode)) {
      selectedLanguage = i18n.locale;
    } else if (availableLanguages.length > 0) {
      selectedLanguage = availableLanguages[0];
    }

    setSelectedLanguage(selectedLanguage as LanguageCode);
  }, [article, i18n.locale, searchParameters, setSelectedLanguage, i18n]);

  useEffect(() => {
    if (!article) {
      return;
    }

    const articleTranslation = article.translations.find(
      (translation) => translation.language === selectedLanguage,
    );

    if (!articleTranslation) {
      return;
    }

    setTitle(articleTranslation.title);
  }, [setTitle, article, selectedLanguage]);

  useEffect(() => {
    if (!articleId) {
      return;
    }

    const getArticle = async () => {
      try {
        const article = await api.getArticle({id: articleId});
        setArticle(article);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the article',
        });
      }
    };

    void getArticle();
  }, [articleId, toasts]);

  if (!article || !selectedLanguage) {
    return null;
  }

  const articleTranslation = article.translations.find(
    (translation) => translation.language === selectedLanguage,
  );

  if (!articleTranslation) {
    return null;
  }

  trackEvent({
    action: 'page-view',
    language: selectedLanguage,
  });

  return (
    <Track>
      <Breadcrumb>
        {article.categoryPath.map((category) => {
          return (
            <LinkContainer
              key={category._id}
              to={{
                pathname:
                  article.categoryPath[0]._id === category._id
                    ? `/article-categories/${category._id}`
                    : `/article-categories/${article.categoryPath[0]._id}/category/${category._id}`,
                search: `?lang=${selectedLanguage}`,
              }}
            >
              <Breadcrumb.Item key={category._id}>
                {category.translations.find(
                  (translation) => translation.language === selectedLanguage,
                )?.name ?? category.translations[0].name}
              </Breadcrumb.Item>
            </LinkContainer>
          );
        })}

        <Breadcrumb.Item active>{articleTranslation.title}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-between mb-3">
        <LanguagePicker
          currentLanguage={selectedLanguage}
          availableLanguages={article.translations.map(
            (translation) => translation.language,
          )}
          onChangeLanguage={(locale) => {
            searchParameters.set('lang', locale);
            setSearchParameters(searchParameters);
          }}
        />
        {isSuperAdmin && (
          <LinkContainer to={`/articles/${article._id}/edit`}>
            <Button variant="primary">Edit</Button>
          </LinkContainer>
        )}
      </div>
      <ArticleView
        article={articleTranslation}
        length={article.length}
        strengths={article.strengths}
      />
    </Track>
  );
}
