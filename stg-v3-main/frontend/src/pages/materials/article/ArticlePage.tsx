import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {Trans} from '@lingui/react/macro';
import {LinkContainer} from 'react-router-bootstrap';
import {useLingui} from '@lingui/react';
import {Breadcrumb, Button} from 'react-bootstrap';
import {type LanguageCode} from '@client/ApiTypes';
import {useGetArticleQuery} from '@client/ApiHooks.js';
import ArticleView from './ArticleView.js';
import {useToasts} from '@/components/toasts/index.js';
import LanguagePicker from '@/components/ui/LanguagePicker.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import CenteredLoader from '@/components/CenteredLoader.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ArticlePage() {
  const {isSuperAdmin} = useCurrentUser();
  const {activeGroup} = useActiveGroup();
  const {articleId} = useParams();
  const {i18n} = useLingui();
  const toasts = useToasts();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>();
  const {
    data: article,
    isLoading,
    error,
  } = useGetArticleQuery({id: articleId!}, {enabled: Boolean(articleId)});

  useEffect(() => {
    if (!article) return;

    const lang = searchParameters.get('lang') as LanguageCode;
    const availableLanguages = article.translations.map(
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
  }, [article, i18n.locale, searchParameters, activeGroup?.language]);

  useEffect(() => {
    if (error) {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while loading the article',
      });
    }
  }, [error, toasts]);

  if (isLoading || !article || !selectedLanguage) {
    return <CenteredLoader />;
  }

  const {
    id,
    length,
    strengths,
    isTimelineArticle,
    timelineStrength,
    timelineAgeGroup,
    timelineChapter,
    translations,
  } = article;

  const articleTranslation = translations.find(
    (translation) => translation.language === selectedLanguage,
  );
  if (!articleTranslation) {
    return (
      <Trans>
        <p>Article not available in this language.</p>
      </Trans>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <PageTitle title={articleTranslation.title}>
          <div className="d-flex justify-content-between gap-1">
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
            {isSuperAdmin ? (
              <LinkContainer to={`/articles/${article.id}/edit`}>
                <Button variant="primary">Edit</Button>
              </LinkContainer>
            ) : null}
          </div>
        </PageTitle>
        {article.categoryPath.length > 1 && (
          <Breadcrumb className="mt-2">
            {article.categoryPath.map((category) => (
              <LinkContainer
                key={category.id}
                to={{
                  pathname:
                    article.categoryPath[0].id === category.id
                      ? `/article-categories/${category.id}`
                      : `/article-categories/${article.categoryPath[0].id}/category/${category.id}`,
                  search: `?lang=${selectedLanguage}`,
                }}
              >
                <Breadcrumb.Item>
                  {category.translations.find(
                    (translation) => translation.language === selectedLanguage,
                  )?.name ?? category.translations[0].name}
                </Breadcrumb.Item>
              </LinkContainer>
            ))}
            <Breadcrumb.Item active>{articleTranslation.title}</Breadcrumb.Item>
          </Breadcrumb>
        )}
      </div>
      <ArticleView
        articleId={id}
        article={articleTranslation}
        language={selectedLanguage}
        length={length}
        strengths={strengths}
        isFree={article.isFree}
        isTimelineArticle={isTimelineArticle}
        timelineStrength={timelineStrength}
        timelineAgeGroup={timelineAgeGroup}
        timelineChapter={timelineChapter}
      />
    </div>
  );
}
