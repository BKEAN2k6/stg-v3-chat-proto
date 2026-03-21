import {useState, useEffect, useMemo, useCallback} from 'react';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import {Button, Fade, Placeholder} from 'react-bootstrap';
import {type StrengthSlug} from '@client/ApiTypes';
import {useQueryClient} from '@tanstack/react-query';
import api from '@client/ApiClient';
import styles from './AiGuidanceBlock.module.scss';
import CrowAnimation, {type AnimPhase} from './CrowAnimation.js';
import AnimatedBubbles from './AnimatedBubbles.js';
import SlideLightbox from '@/components/ui/SlideShow/SlideLightbox.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {useAiGuidance} from '@/context/aiGuidanceContext.js';
import {strengthSlugs} from '@/helpers/strengths.js';
import {
  useCreateStrengthGoalMutation,
  useGetStrengthGoalsQuery,
  useCreateStrengthGoalEventMutation,
  useGetArticleQuery,
} from '@/hooks/useApi.js';
import {useToasts} from '@/components/toasts/index.js';
import useGroupedGoals from '@/components/ui/StrengthGoal/useGroupedGoals.js';
import GoalEditModal from '@/components/ui/StrengthGoal/GoalEditModal.js';
import OffcanvasGoal from '@/components/ui/StrengthGoal/OffcanvasGoal.js';
import {type OffcanvasMode} from '@/components/ui/StrengthGoal/OffcanvasMode.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';
import {track} from '@/helpers/analytics.js';

type NewGoal = {
  strength: StrengthSlug;
  target: number;
  targetDate: string;
  description?: string;
};

const loadingMessages: Record<string, string[]> = {
  en: [
    'Strength Crow is currently changing clothes...',
    'Strength Crow is flying in from another classroom...',
    'Strength Crow is looking for its backpack...',
    'Strength Crow is sharpening its pencils...',
    'Strength Crow is warming up its wings...',
  ],
  fi: [
    'Vahvuusvaris on vaihtamassa vaatteita...',
    'Vahvuusvaris on matkalla toisesta luokkahuoneesta...',
    'Vahvuusvaris etsii reppuaan...',
    'Vahvuusvaris teroittaa kyniään...',
    'Vahvuusvaris venytteleee siipiään...',
  ],
  sv: [
    'Styrkekråkan byter kläder just nu...',
    'Styrkekråkan flyger in från ett annat klassrum...',
    'Styrkekråkan letar efter sin ryggsäck...',
    'Styrkekråkan vässar sina pennor...',
    'Styrkekråkan värmer upp sina vingar...',
  ],
};

const translations: Record<
  string,
  {
    oops: string;
    badDay: string;
    newIdea: string;
    openGoal: string;
    createGoal: string;
    openLesson: string;
    startGame: string;
    starting: string;
  }
> = {
  en: {
    oops: 'Oops!',
    badDay: 'Strength Crow is having a bad day...',
    newIdea: 'New idea?',
    openGoal: 'Open goal',
    createGoal: 'Create Goal',
    openLesson: 'Open Lesson',
    startGame: 'Start Game',
    starting: 'Starting...',
  },
  fi: {
    oops: 'Hups!',
    badDay: 'Vahvuusvariksella on huono päivä...',
    newIdea: 'Uusi idea?',
    openGoal: 'Avaa tavoite',
    createGoal: 'Luo tavoite',
    openLesson: 'Avaa oppituokio',
    startGame: 'Aloita peli',
    starting: 'Käynnistyy...',
  },
  sv: {
    oops: 'Hoppsan!',
    badDay: 'Styrkekråkan har en dålig dag...',
    newIdea: 'Ny idé?',
    openGoal: 'Öppna målet',
    createGoal: 'Skapa mål',
    openLesson: 'Öppna lektionen',
    startGame: 'Starta spelet',
    starting: 'Börjar...',
  },
};

export default function AiGuidanceBlock() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {activeGroup} = useActiveGroup();

  const queryClient = useQueryClient();
  const {getGuidance, fetchGuidance, refetch, isLoading, hasError} =
    useAiGuidance();
  const [showGoalModal, setShowGoalModal] = useState(false);

  const [showSlideshow, setShowSlideshow] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const createGoalMutation = useCreateStrengthGoalMutation();
  const createGoalEventMutation = useCreateStrengthGoalEventMutation();

  const [loadingMessage, setLoadingMessage] = useState('');

  const [offcanvasMode, setOffcanvasMode] = useState<OffcanvasMode>('closed');
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>();
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [animPhase, setAnimPhase] = useState<AnimPhase>('intro');

  const handlePhaseChange = useCallback((phase: AnimPhase) => {
    setAnimPhase(phase);
  }, []);

  const {data: strengthGoals} = useGetStrengthGoalsQuery(
    {id: activeGroup?.id ?? ''},
    {enabled: Boolean(activeGroup?.id)},
  );

  const {activeGoals, completedGoals} = useGroupedGoals(
    strengthGoals ?? [],
    activeGroup?.language ?? 'en',
  );

  const selectedGoal =
    activeGoals.find((g) => g.id === selectedGoalId) ??
    completedGoals.find((g) => g.id === selectedGoalId);

  useEffect(() => {
    const language = activeGroup?.language ?? 'en';
    const messages = loadingMessages[language] ?? loadingMessages.en;
    setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [isLoading, activeGroup?.language]);

  useEffect(() => {
    if (activeGroup?.id) {
      void fetchGuidance(activeGroup.id, {
        language: activeGroup.language || undefined,
        ageGroup: activeGroup.ageGroup || undefined,
      });
    }
  }, [
    activeGroup?.id,
    activeGroup?.language,
    activeGroup?.ageGroup,
    activeGroup?.articleProgress,
    fetchGuidance,
  ]);

  const [bubbleState, setBubbleState] = useState<
    'inactive' | 'active' | 'finishing'
  >('inactive');

  useEffect(() => {
    if (isLoading) {
      setBubbleState('active');
    } else if (bubbleState === 'active' && animPhase === 'loadingEnd') {
      setBubbleState('finishing');
    }
  }, [isLoading, bubbleState, animPhase]);
  const guidanceData = activeGroup?.id ? getGuidance(activeGroup.id) : null;
  const guidance = guidanceData?.guidance;

  // Fetch article for lesson lightbox
  const lessonArticleId =
    guidance?.activityType === 'lesson' ? guidance.activityId : undefined;
  const {data: article} = useGetArticleQuery(
    {id: lessonArticleId ?? ''},
    {enabled: Boolean(lessonArticleId)},
  );
  const [slideIndex, setSlideIndex] = useState(0);

  // Memoize slides to prevent slideIndex reset on every render
  const slidesWithoutNotes = useMemo(() => {
    if (!article || !activeGroup) return [];
    const translation = article.translations.find(
      (t) => t.language === activeGroup.language,
    );
    if (!translation) return [];
    return translation.content.filter((section) => {
      const match = /^---\n[\s\S]*?layout:\s*(\S+)/m.exec(section);
      return match?.[1] !== 'notes';
    });
  }, [article, activeGroup]);

  const handleCreateGoal = async (goal: NewGoal) => {
    if (!activeGroup?.id) return;

    const [year, month, day] = goal.targetDate.split('-').map(Number);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    try {
      await createGoalMutation.mutateAsync({
        pathParameters: {id: activeGroup.id},
        payload: {
          ...goal,
          targetDate: endOfDay.toISOString(),
          description: goal.description ? goal.description.trim() : undefined,
        },
      });
      setShowGoalModal(false);
      void refetch(activeGroup.id, {
        language: activeGroup.language || undefined,
        ageGroup: activeGroup.ageGroup || undefined,
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating the goal`),
      });
    }
  };

  const handleStartGame = async () => {
    if (!activeGroup?.id || !guidance?.activityId) return;

    setIsStartingGame(true);
    try {
      if (guidance.activityId === 'memory') {
        const game = await api.createMemoryGame(
          {id: activeGroup.id},
          {numberOfCards: 16},
        );
        window.open(`/games/${game.id}/host`, '_blank');
      } else if (guidance.activityId === 'sprint') {
        const sprint = await api.createSprint({id: activeGroup.id});
        window.open(`/games/${sprint.id}/host`, '_blank');
      }
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while starting the game`),
      });
    } finally {
      setIsStartingGame(false);
    }
  };

  const suggestedStrength = guidance?.activityId;
  const defaultGoal: NewGoal = {
    strength: strengthSlugs.includes(suggestedStrength as StrengthSlug)
      ? (suggestedStrength as StrengthSlug)
      : 'kindness',
    target: 10,
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    description: '',
  };

  const trackAction = () => {
    track('AI guidance action');
    if (activeGroup?.id && guidance?.logId) {
      void api.updateGuidanceLog(
        {id: activeGroup.id, logId: guidance.logId},
        {action: 'action'},
      );
    }
  };

  const renderActionButton = () => {
    if (!guidance) return null;

    const language = activeGroup?.language ?? 'en';
    const t = translations[language] ?? translations.en;

    if (guidance.activityType === 'goal') {
      const existingGoal = strengthGoals?.find(
        (g) => g.id === guidance.activityId,
      );

      if (existingGoal) {
        return (
          <Button
            variant="primary"
            onClick={() => {
              trackAction();
              setSelectedGoalId(existingGoal.id);
              setOffcanvasMode('small');
            }}
          >
            {t.openGoal}
          </Button>
        );
      }

      return (
        <Button
          variant="primary"
          onClick={() => {
            trackAction();
            setShowGoalModal(true);
          }}
        >
          {t.createGoal}
        </Button>
      );
    }

    if (guidance.activityType === 'lesson' && guidance.activityId) {
      return (
        <Button
          variant="primary"
          onClick={() => {
            trackAction();
            setShowSlideshow(true);
          }}
        >
          {t.openLesson}
        </Button>
      );
    }

    if (guidance.activityType === 'game') {
      return (
        <Button
          variant="primary"
          disabled={isStartingGame}
          onClick={() => {
            trackAction();
            void handleStartGame();
          }}
        >
          {isStartingGame ? t.starting : t.startGame}
        </Button>
      );
    }

    return null;
  };

  const renderContent = () => {
    const placeholders = [
      {id: 'p1', xs: 10},
      {id: 'p2', xs: 9},
      {id: 'p3', xs: 8},
      {id: 'p4', xs: 7},
    ];

    const language = activeGroup?.language ?? 'en';
    const t = translations[language] ?? translations.en;
    const showLoading =
      isLoading ||
      !guidance ||
      (animPhase !== 'speaking' &&
        animPhase !== 'ending' &&
        animPhase !== 'idle');

    return (
      <div
        className={`d-flex flex-column flex-md-row align-items-center align-items-md-stretch gap-3 p-3 mb-3 rounded shadow-sm position-relative ${styles.container}`}
      >
        <CrowAnimation
          isLoading={isLoading}
          className={`${styles.avatar} align-self-md-start`}
          onPhaseChange={handlePhaseChange}
        />
        <div className="flex-grow-1 w-100 d-flex flex-column">
          {hasError ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-bold col-12">{t.oops}</h5>
              </div>
              <p>{t.badDay}</p>
            </>
          ) : showLoading ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-bold col-12">{loadingMessage}</h5>
              </div>
              <div className="mb-2">
                {placeholders.map((placeholder) => (
                  <Placeholder
                    key={placeholder.id}
                    animation="glow"
                    className="d-block mb-1"
                  >
                    <Placeholder xs={placeholder.xs} />
                  </Placeholder>
                ))}
              </div>
              <div className="d-flex justify-content-end mt-auto">
                <Placeholder.Button variant="primary" xs={4} />
              </div>
            </>
          ) : (
            <Fade appear in={!showLoading}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 fw-bold">{guidance.title}</h5>
                </div>
                <div className="mb-3">
                  <MarkdownView content={guidance.suggestionText} />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-auto">
                  <Button
                    variant="outline-secondary"
                    disabled={isLoading}
                    onClick={() => {
                      if (activeGroup?.id) {
                        track('AI guidance new idea');
                        if (guidance?.logId) {
                          void api.updateGuidanceLog(
                            {id: activeGroup.id, logId: guidance.logId},
                            {action: 'refresh'},
                          );
                        }

                        void refetch(activeGroup.id, {
                          language: activeGroup.language || undefined,
                          ageGroup: activeGroup.ageGroup || undefined,
                        });
                      }
                    }}
                  >
                    {t.newIdea}
                  </Button>
                  {renderActionButton()}
                </div>
              </div>
            </Fade>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}

      {bubbleState !== 'inactive' && (
        <AnimatedBubbles
          mode="full-screen"
          state={bubbleState === 'active' ? 'active' : 'finishing'}
          bubbleCount={50}
          estimatedWaitTime={5000}
          spawnRate={2.5}
          onAnimationComplete={() => {
            setBubbleState('inactive');
          }}
        />
      )}

      {guidance?.activityType === 'lesson' &&
      guidance.activityId &&
      article &&
      activeGroup &&
      slidesWithoutNotes.length > 0 ? (
        article.isTimelineArticle ? (
          <SlideLightbox
            isTimelineArticle
            articleId={article.id}
            isOpen={showSlideshow}
            setIsOpen={setShowSlideshow}
            content={slidesWithoutNotes}
            language={activeGroup.language}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
            timelineStrength={article.timelineStrength}
            timelineAgeGroup={article.timelineAgeGroup}
            timelineChapter={article.timelineChapter}
          />
        ) : (
          <SlideLightbox
            articleId={article.id}
            isOpen={showSlideshow}
            setIsOpen={setShowSlideshow}
            content={slidesWithoutNotes}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
            isTimelineArticle={false}
          />
        )
      ) : null}

      <GoalEditModal
        isOpen={showGoalModal}
        goal={defaultGoal}
        onHide={() => {
          setShowGoalModal(false);
        }}
        onSave={handleCreateGoal}
      />

      {selectedGoal ? (
        <OffcanvasGoal
          closeIcon="close"
          mode={offcanvasMode}
          setMode={setOffcanvasMode}
          goal={selectedGoal}
          targetDate={selectedGoal.targetDate}
          onCreateEvent={async () => {
            if (
              isIncrementing ||
              (selectedGoal.events?.length ?? 0) >= selectedGoal.target
            ) {
              return;
            }

            try {
              setIsIncrementing(true);
              await createGoalEventMutation.mutateAsync({
                pathParameters: {id: selectedGoal.id},
              });
              if (
                (selectedGoal.events?.length ?? 0) + 1 >=
                selectedGoal.target
              ) {
                await queryClient.invalidateQueries({
                  queryKey: ['groupStats'],
                });
              }
            } catch {
              toasts.danger({
                header: _(msg`Oops!`),
                body: _(msg`Something went wrong while updating the goal`),
              });
            } finally {
              setIsIncrementing(false);
            }
          }}
        />
      ) : null}
    </>
  );
}
