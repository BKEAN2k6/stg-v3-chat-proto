import {useEffect, useState} from 'react';
import {useNavigate, useBlocker} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ArticleEdit from './ArticleEdit';
import validateArticle from './validateArticle';
import {useToasts} from '@/components/toasts';
import {type Article} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import {useTitle} from '@/context/pageTitleContext';
import {confirm} from '@/components/ui/confirm';

export default function ArticleCreatePage() {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article>({
    _id: '',
    category: '',
    order: Number.MAX_SAFE_INTEGER,
    thumbnail: '',
    length: '',
    strengths: [],
    translations: [],
    categoryPath: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedBy: {
      _id: '',
      firstName: '',
      lastName: '',
      avatar: '',
    },
    isLocked: false,
    isHidden: false,
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const toasts = useToasts();
  const {setTitle} = useTitle();

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
          title: 'Unsaved changes',
          text: 'Are you sure you want to leave the page with unsaved changes',
          confirm: 'Yes, leave',
          cancel: 'No, stay',
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
    setTitle('Create new article');
  }, [setTitle]);

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

      const createdArticle = await api.createArticle(article);
      setIsDirty(false);
      toasts.success({
        header: 'Success!',
        body: 'Material saved successfully',
      });
      navigate(`/articles/${createdArticle._id}/edit`);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the article',
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
          <h1>New Article</h1>
        </div>
        <div>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
      <ArticleEdit article={article} onChange={handleChange} />
    </>
  );
}
