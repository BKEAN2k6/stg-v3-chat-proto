import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect} from 'react';
import {Card, Button, Row, Col} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useQueryClient} from '@tanstack/react-query';
import {type StrengthGoal, type StrengthSlug} from '@client/ApiTypes';
import DemoCard from './DemoCard.js';
import OffcanvasGoal from '@/components/ui/StrengthGoal/OffcanvasGoal.js';
import {type OffcanvasMode} from '@/components/ui/StrengthGoal/OffcanvasMode.js';
import GoalEditModal from '@/components/ui/StrengthGoal/GoalEditModal.js';
import useGroupedGoals from '@/components/ui/StrengthGoal/useGroupedGoals.js';
import GoalCardContent from '@/components/ui/StrengthGoal/GoalCardContent.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';
import {confirm} from '@/components/ui/confirm.js';
import {
  useGetStrengthGoalsQuery,
  useCreateStrengthGoalMutation,
  useUpdateStrengthGoalMutation,
  useRemoveStrengthGoalMutation,
  useRemoveStrengthGoalsByStrengthMutation,
  useCreateStrengthGoalEventMutation,
} from '@/hooks/useApi.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {useAiGuidance} from '@/context/aiGuidanceContext.js';

export default function GoalsPage() {
  const {_, i18n} = useLingui();
  const {activeGroup} = useActiveGroup();
  const {invalidate} = useAiGuidance();
  const queryClient = useQueryClient();
  const toasts = useToasts();

  const {data, isFetched, error} = useGetStrengthGoalsQuery(
    {id: activeGroup?.id ?? ''},
    {
      enabled: Boolean(activeGroup),
    },
  );

  const strengthGoals = data ?? [];
  const createGoalMutation = useCreateStrengthGoalMutation();
  const updateGoalMutation = useUpdateStrengthGoalMutation();
  const removeGoalMutation = useRemoveStrengthGoalMutation();
  const removeGoalsByStrengthMutation =
    useRemoveStrengthGoalsByStrengthMutation();
  const createGoalEventMutation = useCreateStrengthGoalEventMutation();

  const [fullsScreenGoalMode, setFullsScreenGoalMode] =
    useState<OffcanvasMode>('closed');
  const [editModalGoal, setEditModalGoal] = useState<
    Omit<
      StrengthGoal,
      'id' | 'group' | 'createdAt' | 'updatedAt' | 'isSystemCreated'
    > & {
      id?: string;
    }
  >({
    strength: 'selfRegulation',
    target: 0,
    targetDate: '',
    events: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {activeGoals, completedGoals} = useGroupedGoals(
    strengthGoals,
    i18n.locale,
  );
  const [fullScreenGoalId, setFullScreenGoalId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (
      error ??
      createGoalMutation.error ??
      updateGoalMutation.error ??
      removeGoalMutation.error ??
      removeGoalsByStrengthMutation.error ??
      createGoalEventMutation.error
    ) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while processing the goal.`),
      });
    }
  }, [
    error,
    createGoalMutation.error,
    updateGoalMutation.error,
    removeGoalMutation.error,
    removeGoalsByStrengthMutation.error,
    createGoalEventMutation.error,
    toasts,
    _,
  ]);

  const handleCreateGoal = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    setEditModalGoal({
      strength: 'selfRegulation',
      target: 10,
      targetDate: targetDate.toISOString().split('T')[0],
      events: [],
      description: '',
    });
    setIsEditModalOpen(true);
  };

  const saveStrengthGoal = async (goal: {
    id?: string;
    strength: StrengthSlug;
    target: number;
    targetDate: string;
    description?: string;
  }) => {
    const [year, month, day] = goal.targetDate.split('-').map(Number);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
    goal.targetDate = endOfDay.toISOString();
    goal.description = goal.description ? goal.description.trim() : undefined;

    try {
      if (goal.id) {
        await updateGoalMutation.mutateAsync({
          pathParameters: {id: goal.id},
          payload: goal,
        });
      } else {
        if (!activeGroup) return;
        await createGoalMutation.mutateAsync({
          pathParameters: {id: activeGroup.id},
          payload: goal,
        });
      }

      if (activeGroup?.id) {
        invalidate(activeGroup.id);
      }
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const createGoalCountIncrement = async (id: string) => {
    await createGoalEventMutation.mutateAsync({pathParameters: {id}});
    const goal = data?.find((g) => g.id === id);
    if (goal && goal.events.length + 1 >= goal.target && activeGroup?.id) {
      invalidate(activeGroup.id);
      await queryClient.invalidateQueries({queryKey: ['groupStats']});
    }
  };

  const removeStrengthGoal = async (id: string) => {
    const goal = data?.find((g) => g.id === id);
    const wasCompleted = goal && goal.events.length >= goal.target;
    await removeGoalMutation.mutateAsync({pathParameters: {id}});
    if (activeGroup?.id) {
      invalidate(activeGroup.id);
      if (wasCompleted) {
        await queryClient.invalidateQueries({queryKey: ['groupStats']});
      }
    }
  };

  const removeStrengthGoalsByStrength = async (strength: StrengthSlug) => {
    if (!activeGroup) return;

    const confirmed = await confirm({
      title: _(msg`Remove all goals for this strength`),
      text: _(
        msg`Are you sure you want to remove all completed and active goals for this strength? This can't be undone.`,
      ),
      cancel: _(msg`No, cancel`),
      confirm: _(msg`Yes, remove`),
    });

    if (!confirmed) return;

    await removeGoalsByStrengthMutation.mutateAsync({
      pathParameters: {id: activeGroup.id},
      queryParams: {strength},
    });
    invalidate(activeGroup.id);
    await queryClient.invalidateQueries({queryKey: ['groupStats']});
  };

  const redoStrengthGoal = (goal: StrengthGoal) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    setEditModalGoal({
      ...goal,
      id: undefined,
      events: [],
      target: 10,
      targetDate: targetDate.toISOString().split('T')[0],
      description: '',
    });
    setIsEditModalOpen(true);
  };

  const fullScreenGoal = activeGoals.find((g) => g.id === fullScreenGoalId) ??
    completedGoals.find((g) => g.id === fullScreenGoalId) ?? {
      id: '',
      description: '',
      title: '',
      strength: 'selfRegulation',
      events: [],
      target: 0,
      targetDate: '',
      completedCount: 0,
      createdAt: '',
      updatedAt: '',
      group: {
        id: '',
        name: '',
      },
    };

  return (
    <>
      <PageTitle title={_(msg`Goals`)} />

      <Row>
        <Col xs={12} md={6} lg={7}>
          <Trans>
            <h5 className="mt-3">
              Clear goals strengthen learning and teamwork!
            </h5>
            <p>
              Are there challenges in the group with maintaining a peaceful work
              environment, perseverance, or friendly interaction? The
              goal-setting tool helps to establish shared, positively framed
              objectives and tracks the progress.
            </p>
            <p>
              Pedagogically valuable feedback supports motivation and engages
              the group in skill development.
            </p>
          </Trans>
          {activeGoals.length > 0 && isFetched ? (
            <Button variant="outline-primary" onClick={handleCreateGoal}>
              <Trans>Create goal</Trans>
            </Button>
          ) : null}
        </Col>
        <Col
          xs={6}
          lg={5}
          className="d-none d-md-block pe-md-2 pe-lg-4 pe-xl-5 pb-0"
        >
          <DemoCard />
        </Col>
      </Row>

      {!activeGroup && (
        <Card className="text-center mt-3" style={{backgroundColor: '#f9fafb'}}>
          <Card.Body>
            <h4>
              <Trans>No group selected</Trans>
            </h4>
            <p>
              <Trans>
                Select a group or create a new one to start using the goals.
              </Trans>
            </p>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex flex-column gap-3 mt-3">
        {activeGoals.length === 0 && isFetched ? (
          <Card className="text-center" style={{backgroundColor: '#f9fafb'}}>
            <Card.Body>
              <h4>
                <Trans>No active goals</Trans>
              </h4>
              <p>
                <Trans>
                  Your group does not have any active goals at the moment.
                </Trans>
              </p>
              <Button variant="primary" onClick={handleCreateGoal}>
                <Trans>Create goal</Trans>
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <div>
            {activeGoals.length > 0 && (
              <h6>
                <Trans>Active</Trans>
              </h6>
            )}
            <div className="card-container">
              {activeGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className="card-w-100 card-w-md-50 card-w-lg-33"
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setFullScreenGoalId(goal.id);
                    setFullsScreenGoalMode('small');
                  }}
                >
                  <GoalCardContent
                    id={goal.id}
                    description={goal.description}
                    title={goal.title}
                    strength={goal.strength}
                    target={goal.target}
                    targetDate={goal.targetDate}
                    events={goal.events}
                    completedCount={goal.completedCount}
                    onGoalRemove={async () => {
                      await removeStrengthGoal(goal.id);
                    }}
                    onGoalEdit={() => {
                      const editGoal = strengthGoals.find(
                        (g) => g.id === goal.id,
                      );
                      if (editGoal) {
                        setEditModalGoal(editGoal);
                        setIsEditModalOpen(true);
                      }
                    }}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          {completedGoals.length > 0 && (
            <h6>
              <Trans>Completed</Trans>
            </h6>
          )}
          <div className="card-container">
            {completedGoals.map((goal, index) => (
              <Card
                key={goal.id}
                className="card-w-100 card-w-md-50 card-w-lg-33"
                style={{cursor: 'not-allowed'}}
              >
                <GoalCardContent
                  id={goal.id}
                  description={goal.description}
                  title={goal.title}
                  strength={goal.strength}
                  target={goal.target}
                  targetDate={goal.targetDate}
                  events={goal.events}
                  completedCount={goal.completedCount}
                  trophyDelay={(index * 5000) / completedGoals.length}
                  onGoalRemove={async () =>
                    removeStrengthGoalsByStrength(goal.strength)
                  }
                  onGoalRedo={() => {
                    redoStrengthGoal(goal);
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        <GoalEditModal
          isOpen={isEditModalOpen}
          goal={editModalGoal}
          onHide={() => {
            setIsEditModalOpen(false);
          }}
          onSave={saveStrengthGoal}
        />

        <OffcanvasGoal
          closeIcon="close"
          goal={fullScreenGoal}
          mode={fullsScreenGoalMode}
          setMode={setFullsScreenGoalMode}
          targetDate={fullScreenGoal.targetDate}
          onCreateEvent={async () => {
            await createGoalCountIncrement(fullScreenGoal.id);
          }}
        />
      </div>
    </>
  );
}
