import {type StrengthGoal, type StrengthSlug} from '@client/ApiTypes';
import {Card} from 'react-bootstrap';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {useState, useEffect, useRef} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import CreateGoalCard from './CreateGoalCard.js';
import GoalEditModal from '@/components/ui/StrengthGoal/GoalEditModal.js';
import useGroupedGoals, {
  type GroupedGoal,
} from '@/components/ui/StrengthGoal/useGroupedGoals.js';
import GoalCardContent from '@/components/ui/StrengthGoal/GoalCardContent.js';
import {useToasts} from '@/components/toasts/index.js';
import {strengthColorMap} from '@/helpers/strengths.js';
import OffcanvasGoal from '@/components/ui/StrengthGoal/OffcanvasGoal.js';
import {type OffcanvasMode} from '@/components/ui/StrengthGoal/OffcanvasMode.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {useAiGuidance} from '@/context/aiGuidanceContext.js';
import {usePostsRefresh} from '@/context/usePostsRefresh.js';
import {
  useGetStrengthGoalsQuery,
  useCreateStrengthGoalMutation,
  useCreateStrengthGoalEventMutation,
} from '@/hooks/useApi.js';
import {CrossFade} from '@/components/ui/CrossFade/CrossFade.js';

type NewGoal = Omit<
  StrengthGoal,
  'id' | 'group' | 'createdAt' | 'updatedAt' | 'events'
> & {
  id?: string;
};

type Properties = {
  readonly defaultStrength: StrengthSlug;
};

export default function LastActiveGoal({defaultStrength}: Properties) {
  const {_, i18n} = useLingui();
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [fullsScreenGoalMode, setFullsScreenGoalMode] =
    useState<OffcanvasMode>('closed');
  const [activeGoalId, setActiveGoalId] = useState<string | undefined>(
    undefined,
  );
  const [showGoalModal, setShowGoalModal] = useState(false);
  const {refreshPosts} = usePostsRefresh();
  const [goalEdit, setGoalEdit] = useState<NewGoal>({
    strength: defaultStrength,
    target: 10,
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    description: '',
  });
  const toggleReference = useRef<HTMLDivElement>(null);
  const closeTimerReference = useRef<
    ReturnType<typeof globalThis.setTimeout> | undefined
  >(undefined);
  const {activeGroup} = useActiveGroup();
  const {invalidate} = useAiGuidance();
  const queryClient = useQueryClient();
  const activeGroupId = activeGroup?.id;

  const {
    data,
    isLoading: isLoadingGoals,
    error: strengthGoalsError,
  } = useGetStrengthGoalsQuery(
    {id: activeGroupId!},
    {enabled: Boolean(activeGroupId)},
  );

  const strengthGoals = data ?? [];

  useEffect(() => {
    if (strengthGoalsError) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong`),
      });
    }
  }, [strengthGoalsError, toasts, _]);

  const {activeGoals, completedGoals} = useGroupedGoals(
    strengthGoals,
    i18n.locale,
  );

  useEffect(() => {
    if (closeTimerReference.current) {
      globalThis.clearTimeout(closeTimerReference.current);
      closeTimerReference.current = undefined;
    }

    if (fullsScreenGoalMode !== 'closed') return;

    closeTimerReference.current = globalThis.setTimeout(() => {
      let latestGoal: GroupedGoal | undefined;
      let overallLatestDate: Date = new Date(0);

      for (const g of activeGoals) {
        let goalLatestDate: Date;
        if (g.events && g.events.length > 0) {
          goalLatestDate = new Date(g.events[0].createdAt);
          for (const event of g.events) {
            const eventDate = new Date(event.createdAt);
            if (eventDate > goalLatestDate) {
              goalLatestDate = eventDate;
            }
          }
        } else {
          goalLatestDate = new Date(g.updatedAt);
        }

        if (goalLatestDate > overallLatestDate) {
          overallLatestDate = goalLatestDate;
          latestGoal = g;
        }
      }

      if (latestGoal) {
        setActiveGoalId(latestGoal.id);
      }
    }, 300);

    return () => {
      if (closeTimerReference.current) {
        globalThis.clearTimeout(closeTimerReference.current);
        closeTimerReference.current = undefined;
      }
    };
  }, [activeGoals, fullsScreenGoalMode]);

  const createGoalMutation = useCreateStrengthGoalMutation();
  const createGoalEventMutation = useCreateStrengthGoalEventMutation();

  const resetGoalEdit = () => {
    setGoalEdit({
      strength: defaultStrength,
      target: 10,
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      description: '',
    });
  };

  const handleOpenGoalModal = () => {
    resetGoalEdit();
    setShowGoalModal(true);
  };

  async function createGoal(goal: NewGoal, groupId?: string) {
    if (!activeGroupId && !groupId) {
      return;
    }

    const [year, month, day] = goal.targetDate.split('-').map(Number);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
    goal.targetDate = endOfDay.toISOString();
    goal.description = goal.description ? goal.description.trim() : undefined;
    try {
      await createGoalMutation.mutateAsync({
        pathParameters: {id: (groupId ?? activeGroupId)!},
        payload: goal,
      });

      if (groupId ?? activeGroupId) {
        invalidate((groupId ?? activeGroupId)!);
      }
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating the goal`),
      });
    } finally {
      setShowGoalModal(false);
    }
  }

  async function createGoalCountIncrement(goal: GroupedGoal) {
    try {
      await createGoalEventMutation.mutateAsync({
        pathParameters: {id: goal.id},
      });

      if (goal.events.length + 1 >= goal.target) {
        refreshPosts();
        if (activeGroupId) {
          invalidate(activeGroupId);
          await queryClient.invalidateQueries({queryKey: ['groupStats']});
        }
      }
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while updating the goal`),
      });
    }
  }

  if (isLoadingGoals || !currentUser || !activeGroupId) {
    return null;
  }

  const currentActiveGoal =
    activeGoals.find((g) => g.id === activeGoalId) ??
    completedGoals.find((g) => g.id === activeGoalId);

  const darkerColor = strengthColorMap[defaultStrength][300];
  const borderColor = strengthColorMap[defaultStrength][500];
  const lighterColor = strengthColorMap[defaultStrength][100];

  const shouldShowCreate =
    !currentActiveGoal ||
    currentActiveGoal.events.length >= currentActiveGoal.target;

  return (
    <>
      {activeGoals.length === 0 && shouldShowCreate ? (
        <div>
          <CrossFade contentKey={defaultStrength}>
            <CreateGoalCard
              defaultStrength={defaultStrength}
              darkerColor={darkerColor}
              lighterColor={lighterColor}
              borderColor={borderColor}
              onClick={handleOpenGoalModal}
            />
          </CrossFade>
          <GoalEditModal
            isOpen={showGoalModal}
            goal={goalEdit}
            onHide={() => {
              setShowGoalModal(false);
            }}
            onSave={async (goalData) => {
              await createGoal(goalData, activeGroupId);
            }}
          />
        </div>
      ) : currentActiveGoal ? (
        <CrossFade contentKey={currentActiveGoal.id}>
          <Card
            ref={toggleReference}
            style={{cursor: 'pointer'}}
            onClick={(event) => {
              event.stopPropagation();
              setFullsScreenGoalMode((previousMode) =>
                previousMode === 'small' ? 'closed' : 'small',
              );
            }}
          >
            <GoalCardContent
              isAnimated
              id={currentActiveGoal.id}
              description={currentActiveGoal.description}
              title={currentActiveGoal.title}
              strength={currentActiveGoal.strength}
              target={currentActiveGoal.target}
              targetDate={currentActiveGoal.targetDate}
              events={currentActiveGoal.events}
              completedCount={currentActiveGoal.completedCount}
            />
          </Card>
        </CrossFade>
      ) : null}
      {currentActiveGoal ? (
        <OffcanvasGoal
          closeIcon="close"
          mode={fullsScreenGoalMode}
          setMode={setFullsScreenGoalMode}
          goal={currentActiveGoal}
          targetDate={currentActiveGoal.targetDate}
          toggleRef={toggleReference}
          onCreateEvent={async () => {
            if (
              isIncrementing ||
              currentActiveGoal.completedCount >= currentActiveGoal.target
            ) {
              return;
            }

            try {
              setIsIncrementing(true);
              await createGoalCountIncrement(currentActiveGoal);
            } catch {
            } finally {
              setIsIncrementing(false);
            }
          }}
        />
      ) : null}
    </>
  );
}
