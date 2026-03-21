import {useEffect, useState} from 'react';
import {useParams, useNavigate, useBlocker} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ArticleEdit from './ArticleEdit';
import validateArticle from './validateArticle';
import {useToasts} from '@/components/toasts';
import {type Article} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import {useTitle} from '@/context/pageTitleContext';
import {confirm} from '@/components/ui/confirm';

export default function ArticleEditPage() {
  const {setTitle} = useTitle();
  const {articleId} = useParams();
  const [article, setArticle] = useState<Article>();
  const [isDirty, setIsDirty] = useState<boolean>(false);
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
        event.returnValue = isDirty;
        return isDirty;
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
          title: 'Warning:  Unsaved changes',
          text: 'Are you sure you want to leave the page with unsaved changes',
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
    setTitle('Edit Article');
  }, [setTitle]);

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

  if (!article) {
    return null;
  }

  const handleSave = async () => {
    try {
      const errors = validateArticle(article);

      if (errors.length > 0) {
        toasts.danger({
          header: 'Oops!',
          body: errors.join(' '),
        });
        return;
      }

      const existingArticle = await api.getArticle({id: article._id});

      if (existingArticle.updatedAt === article.updatedAt) {
        setArticle(await api.updateArticle({id: article._id}, article));
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
          setArticle(await api.updateArticle({id: article._id}, article));
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
      text: 'Are you sure you want to remove the article',
      confirm: 'Yes, remove',
      cancel: 'No, cancel',
    });

    if (!confirmed) {
      return;
    }

    try {
      await api.removeArticle({id: article._id});
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

  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <h1>Edit article</h1>
        </div>
        <div>
          <Button variant="primary" onClick={handleSave}>
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
        </div>
      </div>
      <ArticleEdit article={article} onChange={handleChange} />
    </>
  );
}
