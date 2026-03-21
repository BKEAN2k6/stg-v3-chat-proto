import {useEffect, useState} from 'react';
import {useNavigate, useBlocker} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {type Article} from '@client/ApiTypes';
import api from '@client/ApiClient';
import ArticleEdit from './ArticleEdit.js';
import validateArticle from './validateArticle.js';
import {useToasts} from '@/components/toasts/index.js';
import {confirm} from '@/components/ui/confirm.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ArticleCreatePage() {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article>({
    id: '',
    category: '',
    order: 0,
    thumbnail: '',
    length: '',
    strengths: [],
    translations: [],
    categoryPath: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedBy: {
      id: '',
      firstName: '',
      lastName: '',
      avatar: '',
    },
    isLocked: false,
    isHidden: false,
    isTimelineArticle: false,
    timelineChapter: 'start',
    timelineAgeGroup: 'preschool',
    timelineStrength: 'kindness',
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const toasts = useToasts();

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
      navigate(`/articles/${createdArticle.id}/edit`);
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
    <div className="d-flex flex-column gap-3">
      <PageTitle title="New Article">
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </PageTitle>

      <ArticleEdit article={article} onChange={handleChange} />
    </div>
  );
}
