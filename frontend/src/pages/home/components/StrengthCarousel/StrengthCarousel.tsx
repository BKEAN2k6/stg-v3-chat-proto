import {useEffect, useMemo, useRef, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {type ArticleChapter} from '@client/ApiTypes.js';
import {
  type ArticleSelection,
  type CompletedArticles,
  getDefaultSelection,
  getCompletedArticles,
  getCurrentChapters,
} from '@shared/timelineProgress.js';
import StrengthTimeline from './StrengthTimeline.js';
import StrengthCarouselSlides from './StrengthCarouselSlides.js';
import StrengthCarouselHeader from './StrengthCarouselHeader.js';
import SettingsPopover from './SettingsPopover.js';
import {strengthColorMap} from '@/helpers/strengths.js';
import {useGetTimelineArticlesQuery} from '@/hooks/useApi.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {track} from '@/helpers/analytics.js';

type Properties = {
  readonly onStrengthChange?: (strength: ArticleSelection['strength']) => void;
  readonly className?: string;
  readonly isDemo?: boolean;
};

export default function StrengthCarousel({
  onStrengthChange,
  className,
  isDemo,
}: Properties) {
  const {data: timelineArticles} = useGetTimelineArticlesQuery();
  const {activeGroup} = useActiveGroup();
  const [selection, setSelection] = useState<ArticleSelection>();
  const previousReference = useRef<{
    id?: string;
    progress?: NonNullable<typeof activeGroup>['articleProgress'];
    ageGroup?: NonNullable<typeof activeGroup>['ageGroup'];
  }>({});

  useEffect(() => {
    if (!timelineArticles?.length || !activeGroup) return;

    const {id, articleProgress, ageGroup} = activeGroup;

    if (
      previousReference.current.id === id &&
      previousReference.current.progress === articleProgress &&
      previousReference.current.ageGroup === ageGroup
    ) {
      return;
    }

    previousReference.current = {id, progress: articleProgress, ageGroup};
    const defaultSel = getDefaultSelection(
      timelineArticles,
      articleProgress,
      ageGroup,
    );
    setSelection(defaultSel);
  }, [timelineArticles, activeGroup]);

  useEffect(() => {
    if (selection && onStrengthChange) {
      onStrengthChange(selection.strength);
    }
  }, [selection, onStrengthChange]);

  const completedArticles = useMemo<CompletedArticles[]>(() => {
    if (!timelineArticles || !activeGroup || !selection) return [];
    return getCompletedArticles(
      timelineArticles,
      activeGroup.articleProgress,
      selection.ageGroup,
    );
  }, [timelineArticles, activeGroup, selection]);

  const currentChapters = useMemo<
    | Record<ArticleChapter, {id: string; status: 'read' | 'next' | 'unread'}>
    | undefined
  >(() => {
    if (!timelineArticles || !activeGroup || !selection) return undefined;
    return getCurrentChapters(
      timelineArticles,
      activeGroup.articleProgress,
      selection,
    );
  }, [timelineArticles, activeGroup, selection]);

  const [chapter, setChapter] = useState<ArticleChapter>('start');

  useEffect(() => {
    if (!currentChapters) return;
    const next =
      (Object.keys(currentChapters).find(
        (key) => currentChapters[key as ArticleChapter].status === 'next',
      ) as ArticleChapter) || 'start';
    setChapter(next);
  }, [selection, currentChapters]);

  const [isOpen, setIsOpen] = useState(false);
  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) track('Home page slides open');
  };

  if (!selection || !currentChapters) {
    return null;
  }

  const color = strengthColorMap[selection.strength][300];

  return (
    <ErrorBoundary FallbackComponent={() => null}>
      <div
        className={`rounded border transition-background ${className ?? ''}`}
        style={{backgroundColor: color}}
      >
        <div className="d-flex gap-3 p-3 pb-0 rounded-top justify-content-between align-items-center">
          <StrengthCarouselHeader
            selectedStrength={selection.strength}
            selectedAgeGroup={selection.ageGroup}
          />
          <SettingsPopover
            completedArticles={completedArticles}
            selection={selection}
            setSelection={setSelection}
          />
        </div>

        <div className="bg-white rounded-top m-2 mb-0 px-3 pt-4 pt-sm-5 pb-3">
          <StrengthTimeline
            selectedChapter={chapter}
            currentChapters={currentChapters}
            strength={selection.strength}
            isDemo={isDemo}
            onClick={setChapter}
          />
        </div>

        <div className="bg-white rounded-bottom m-2 mt-0 p-3 pt-0">
          <StrengthCarouselSlides
            isOpen={isOpen}
            setIsOpen={handleSetIsOpen}
            articleId={currentChapters[chapter]?.id ?? ''}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
