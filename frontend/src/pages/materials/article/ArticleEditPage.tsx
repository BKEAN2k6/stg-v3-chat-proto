import {useEffect, useState} from 'react';
import {useParams, useNavigate, useBlocker} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {type Article, type LanguageCode} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {Breadcrumb} from 'react-bootstrap';
import ArticleEdit from './ArticleEdit.js';
import validateArticle from './validateArticle.js';
import SaveModal from './SaveModal.js';
import {useToasts} from '@/components/toasts/index.js';
import {confirm} from '@/components/ui/confirm.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ArticleEditPage() {
  const {articleId} = useParams();
  const [article, setArticle] = useState<Article>();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [tranlationId, setTranlationId] = useState<string>();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  const toasts = useToasts();
  const navigate = useNavigate();

  const blocker = useBlocker(
    ({currentLocation, nextLocation}) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const checkBlocker = async () => {
      if (blocker.state !== 'blocked') {
        return;
      }

      if (isDirty) {
        const confirmed = await confirm({
          title: 'Warning: Unsaved changes',
          text: 'Are you sure you want to leave the page with unsaved changes?',
          confirm: 'Yes, leave',
          cancel: 'No, stay',
          confirmVariant: 'danger',
        });

        if (confirmed) {
          blocker.proceed();
        } else {
          blocker.reset();
        }
      } else {
        blocker.proceed();
      }
    };

    void checkBlocker();
  }, [blocker, isDirty]);

  useEffect(() => {
    if (!articleId) {
      return;
    }

    const getMaterial = async () => {
      try {
        const article = await api.getArticle({id: articleId});
        setArticle(article);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while saving the material',
        });
      }
    };

    void getMaterial();
  }, [articleId, toasts]);

  useEffect(() => {
    const fetchPendingTranslation = async () => {
      if (!isTranslating || !tranlationId || !article) {
        return;
      }

      try {
        const translation = await api.getTranslationJob({id: tranlationId});
        if (translation.isFinished) {
          setIsTranslating(false);

          if (translation.errorMessage) {
            toasts.danger({
              header: 'Oops!',
              body: 'Something went wrong while processing the translation',
            });
            return;
          }

          handleChange({
            ...article,
            translations: article.translations.map((t) =>
              t.language === translation.result?.language
                ? {
                    ...t,
                    title: translation.result.title,
                    description: translation.result.description,
                    content: translation.result.content,
                  }
                : t,
            ),
          });
          setIsTranslating(false);
        } else {
          setTimeout(fetchPendingTranslation, 5000);
        }
      } catch {
        setIsTranslating(false);
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching challenge data',
        });
      }
    };

    void fetchPendingTranslation();
  }, [isTranslating, tranlationId, article, toasts]);

  if (!article) {
    return null;
  }

  const handleSaveModal = async (
    updatedArticle: Article,
    changeLog: string,
  ) => {
    setIsSaveModalOpen(false);

    const errors = validateArticle(updatedArticle);
    if (errors.length > 0) {
      toasts.danger({
        header: 'Oops!',
        body: errors.join(' '),
      });
      return;
    }

    try {
      const existingArticle = await api.getArticle({id: updatedArticle.id});

      if (existingArticle.updatedAt === updatedArticle.updatedAt) {
        const newArticle = await api.updateArticle(
          {id: updatedArticle.id},
          {
            ...updatedArticle,
            changeLog,
          },
        );
        setArticle(newArticle);
      } else {
        const {firstName, lastName} = existingArticle.updatedBy;
        const formattedDate = new Date(
          existingArticle.updatedAt,
        ).toLocaleString();
        const confirmed = await confirm({
          title: 'Warning: Overwriting changes',
          text: `This article has been updated by ${firstName} ${lastName} at ${formattedDate}. Do you want to overwrite the changes?`,
          confirm: 'Yes, overwrite',
          cancel: 'No, cancel',
          confirmVariant: 'danger',
        });

        if (confirmed) {
          const newArticle = await api.updateArticle(
            {id: updatedArticle.id},
            {
              ...updatedArticle,
              changeLog,
            },
          );
          setArticle(newArticle);
        } else {
          return;
        }
      }

      setIsDirty(false);
      toasts.success({
        header: 'Success!',
        body: 'Article saved successfully',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the article',
      });
    }
  };

  const handleRemove = async () => {
    const confirmed = await confirm({
      title: 'Remove article',
      text: 'Are you sure you want to remove the article?',
      confirm: 'Yes, remove',
      cancel: 'No, cancel',
    });

    if (!confirmed) {
      return;
    }

    try {
      await api.removeArticle({id: article.id});
      setIsDirty(false);
      navigate('/articles');
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while removing the article',
      });
    }
  };

  const handleChange = (article: Article) => {
    setIsDirty(true);
    setArticle(article);
  };

  const onTranslate = async (
    source: LanguageCode,
    targetLanguage: LanguageCode,
  ) => {
    const existingTranslation = article.translations.find(
      (t) => t.language === targetLanguage,
    );

    if (!existingTranslation) {
      return;
    }

    const notEmpty =
      existingTranslation.title.length > 0 ||
      existingTranslation.description.length > 0 ||
      existingTranslation.content.some((c) => c.length > 0);

    if (notEmpty) {
      const confirmed = await confirm({
        title: 'Overwrite translation',
        text: 'Do you want to overwrite the existing translation?',
        confirm: 'Yes, overwrite',
        cancel: 'No, cancel',
      });

      if (!confirmed) {
        return;
      }
    }

    const sourceTranslation = article.translations.find(
      (t) => t.language === source,
    );

    if (!sourceTranslation) {
      return;
    }

    try {
      setIsTranslating(true);
      const translationJob = await api.createTranlationJob({
        source: sourceTranslation,
        targetLanguage,
      });

      setTranlationId(translationJob.id);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while translating the article',
      });
      setIsTranslating(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <PageTitle title="Edit article">
          <Button
            variant="primary"
            onClick={() => {
              setIsSaveModalOpen(true);
            }}
          >
            Save
          </Button>
          <Button
            variant="danger"
            className="ms-2"
            onClick={async () => {
              await handleRemove();
            }}
          >
            Remove
          </Button>
        </PageTitle>

        <Breadcrumb className="mt-2">
          {article.categoryPath.map((category) => (
            <Breadcrumb.Item key={category.id} active>
              {category.translations.find(
                (translation) => translation.language === 'en',
              )?.name ?? category.translations[0].name}
            </Breadcrumb.Item>
          ))}
          <Breadcrumb.Item active>
            {article.translations.find(
              (translation) => translation.language === 'en',
            )?.title ?? article.translations[0].title}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <ArticleEdit
        article={article}
        isTranslating={isTranslating}
        onChange={handleChange}
        onTranslate={onTranslate}
      />

      <SaveModal
        isOpen={isSaveModalOpen}
        article={article}
        onClose={() => {
          setIsSaveModalOpen(false);
        }}
        onSave={handleSaveModal}
      />
    </div>
  );
}
