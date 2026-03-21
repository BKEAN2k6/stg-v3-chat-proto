import {useState, useEffect} from 'react';
import {ChevronRight, ChevronLeft} from 'react-bootstrap-icons';
import {Trans} from '@lingui/macro';
import Carousel from 'react-bootstrap/Carousel';
import StrengthTimeline, {type StrengthPeriodWithEnd} from './StrengthTimeline';
import {type StrengthSlug} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {strengthColorMap} from '@/helpers/strengths';

export type TimelineItemWihtoutEnd = {
  start: string;
  articleId: string;
  rootCategoryId: string;
};

export type StrengthPeriodWihtoutEnd = {
  _id: string;
  strength: StrengthSlug;
  timeline: [
    TimelineItemWihtoutEnd,
    TimelineItemWihtoutEnd,
    TimelineItemWihtoutEnd,
    TimelineItemWihtoutEnd,
  ];
};

function findCurrentPeriodIndex(periods: StrengthPeriodWithEnd[]): number {
  const currentTime = new Date();
  const currentPeriodIndex = periods.findIndex((period) => {
    const startDate = new Date(period.timeline[0].start);
    const endDate = new Date(period.timeline[3].end);

    return currentTime >= startDate && currentTime <= endDate;
  });

  return currentPeriodIndex;
}

export default function StrengthTimelineCarousel() {
  const [periods, setPeriods] = useState<StrengthPeriodWithEnd[]>([]);
  const [index, setIndex] = useState(-1);
  const toasts = useToasts();

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await api.getStrengthPeriods();
        const periods = response.map((period, periodIndex) => {
          const timeline = period.timeline.map(
            (timelineItem, timelineItemIndex) => {
              const start = new Date(timelineItem.start);
              let end;

              if (timelineItemIndex === 3) {
                end = response[periodIndex + 1]
                  ? new Date(response[periodIndex + 1].timeline[0].start)
                  : new Date('9999-12-31T23:59:59.999Z');
              } else {
                end = new Date(period.timeline[timelineItemIndex + 1].start);
              }

              return {
                start,
                end,
                articleId: timelineItem.articleId,
                rootCategoryId: timelineItem.rootCategoryId,
              };
            },
          );

          return {
            ...period,
            timeline,
          };
        });

        periods.sort((a, b) => {
          const aStartDate = a.timeline[0].start;
          const bStartDate = b.timeline[0].start;

          return aStartDate < bStartDate ? -1 : 1;
        });

        setPeriods(periods);
        const currentPeriodIndex = findCurrentPeriodIndex(periods);
        setIndex(currentPeriodIndex);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching the periods',
        });
      }
    };

    void fetchPeriods();
  }, [toasts]);

  const handleNext = () => {
    if (index >= periods.length - 1) {
      return;
    }

    setIndex((previousIndex) => previousIndex + 1);
  };

  const handlePrevious = () => {
    if (index <= 0) {
      return;
    }

    setIndex((previousIndex) => previousIndex - 1);
  };

  if (index === -1) {
    return null;
  }

  const hasNext = index < periods.length - 1;
  const hasPrevious = index > 0;
  const color = strengthColorMap[periods[index].strength][300];

  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className="rounded border mb-4 transition-background"
    >
      <div className="d-flex justify-content-between m-2 py-2 fw-bold">
        <div
          style={{
            width: 32,
          }}
        >
          {hasPrevious && (
            <div
              className="d-flex align-items-end align-items-center flex-grow-0 btn"
              style={{
                padding: '0.5rem',
              }}
              onClick={handlePrevious}
            >
              <ChevronLeft size={14} />
            </div>
          )}
        </div>
        <div className="d-flex justify-content-center align-items-center flex-grow-1 fs-5">
          <Trans>Strength of the Month</Trans>
        </div>
        <div
          style={{
            width: 32,
          }}
        >
          {hasNext && (
            <div
              className="d-flex align-items-end  align-items-center justify-content-end flex-grow-0 btn"
              style={{
                padding: '0.5rem',
              }}
              onClick={handleNext}
            >
              <ChevronRight size={14} />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded m-2">
        <Carousel activeIndex={index} controls={false} indicators={false}>
          {periods.map((period) => (
            <Carousel.Item key={period._id}>
              <StrengthTimeline period={period} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
