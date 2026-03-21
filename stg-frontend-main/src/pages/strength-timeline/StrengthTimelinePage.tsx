import {useState, useEffect, useCallback} from 'react';
import {Button, Accordion} from 'react-bootstrap';
import StrengthPeriodForm from './StrengthPeriodForm';
import CreatetrengthPeriodModal from './CreateStrengthPeriodModal';
import {
  type StrengthPeriod,
  type ArticleCategoryListItem,
} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {strengthTranslationMap} from '@/helpers/strengths';
import {confirm} from '@/components/ui/confirm';
import {useTitle} from '@/context/pageTitleContext';

export default function StrengthTimelinePage() {
  const {setTitle} = useTitle();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [periods, setPeriods] = useState<StrengthPeriod[]>([]);
  const [newPeriod, setNewPeriod] = useState<StrengthPeriod | undefined>();
  const [categories, setCategories] = useState<ArticleCategoryListItem[]>([]);
  const toasts = useToasts();

  const setNewNextPeriod = useCallback(() => {
    const lastStart = periods.at(-1)?.timeline[3].start;
    const nextStart = new Date(
      lastStart
        ? new Date(lastStart).getTime() + 7 * 24 * 60 * 60 * 1000
        : Date.now(),
    );

    setNewPeriod({
      _id: '',
      strength: 'love',
      timeline: [
        {
          _id: '1',
          start: nextStart.toISOString(),
          articleId: '',
          rootCategoryId: '',
        },
        {
          _id: '2',
          start: new Date(
            nextStart.getTime() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          articleId: '',
          rootCategoryId: '',
        },
        {
          _id: '3',
          start: new Date(
            nextStart.getTime() + 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          articleId: '',
          rootCategoryId: '',
        },
        {
          _id: '4',
          start: new Date(
            nextStart.getTime() + 21 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          articleId: '',
          rootCategoryId: '',
        },
      ],
    });
  }, [periods]);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const periods = await api.getStrengthPeriods();
        setPeriods(periods);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching the periods',
        });
      }
    };

    const fetchArticles = async () => {
      try {
        const categories = await api.getArticleCategories();
        setCategories(categories);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching the articles',
        });
      }
    };

    setTitle('Strength Timeline');
    void fetchPeriods();
    void fetchArticles();
  }, [toasts, setTitle]);

  useEffect(() => {
    setNewNextPeriod();
  }, [periods, setNewNextPeriod]);

  const onPeriodChange = async (updatedPeriod: StrengthPeriod) => {
    try {
      await api.updateStrengthPeriod({id: updatedPeriod._id}, updatedPeriod);
      setPeriods(
        periods.map((period) =>
          period._id === updatedPeriod._id ? updatedPeriod : period,
        ),
      );
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while updating the period',
      });
    }
  };

  const onCreatePeriod = async () => {
    try {
      if (!newPeriod) {
        return;
      }

      setIsCreateModalOpen(false);
      const createdPeriod = await api.createStrengthPeriod(newPeriod);
      setPeriods([...periods, createdPeriod]);
      setNewNextPeriod();
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while creating the period',
      });
    }
  };

  const onNewChange = async (updatedPeriod: StrengthPeriod) => {
    setNewPeriod(updatedPeriod);
  };

  const onRemovePeriod = async (period: StrengthPeriod) => {
    try {
      const confirmed = await confirm({
        title: 'Remove Period',
        text: 'Are you sure you want to delete this period?',
        confirm: 'Remove',
        cancel: 'Cancel',
      });

      if (!confirmed) {
        return;
      }

      await api.removeStrengthPeriod({id: period._id});
      setPeriods(periods.filter((p) => p._id !== period._id));
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while deleting the period',
      });
    }
  };

  if (!newPeriod) {
    return null;
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
        >
          Create Period
        </Button>
      </div>
      <Accordion>
        {periods
          .sort((a, b) => {
            return (
              new Date(a.timeline[0].start).getTime() -
              new Date(b.timeline[0].start).getTime()
            );
          })
          .map((period, index) => {
            return (
              <Accordion.Item key={period._id} eventKey={index.toString()}>
                <Accordion.Header>
                  <span className="fw-bold me-1">
                    {strengthTranslationMap[period.strength].en}
                  </span>
                  {new Date(period.timeline[0].start).toLocaleDateString()} -{' '}
                  {index < periods.length - 1
                    ? new Date(
                        periods[index + 1].timeline[0].start,
                      ).toLocaleDateString()
                    : '...'}
                </Accordion.Header>
                <Accordion.Body>
                  <StrengthPeriodForm
                    period={period}
                    categories={categories}
                    onChange={onPeriodChange}
                  />
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={async () => {
                        await onRemovePeriod(period);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
      </Accordion>
      <CreatetrengthPeriodModal
        isOpen={isCreateModalOpen}
        categories={categories}
        period={newPeriod}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onChange={onNewChange}
        onSave={onCreatePeriod}
      />
    </div>
  );
}
