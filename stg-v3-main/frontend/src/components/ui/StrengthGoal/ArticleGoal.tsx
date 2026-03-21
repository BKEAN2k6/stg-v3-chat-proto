import {useState, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {useCreateStrengthGoalMutation} from '@client/ApiHooks.js';
import OffcanvasFloatingButton from './OffcanvasFloatingButton.js';
import {type OffcanvasMode} from './OffcanvasMode.js';
import OffcanvasGoal from './OffcanvasGoal.js';
import {type GroupedGoal} from '@/components/ui/StrengthGoal/useGroupedGoals.js';
import useToasts from '@/components/toasts/useToasts.js';

type Properties = {
  readonly goal: GroupedGoal;
  readonly setGoal: (goal: GroupedGoal) => void;
  readonly goalButtonSize: number;
};

export default function ArticleGoal({
  goal,
  setGoal,
  goalButtonSize,
}: Properties) {
  const {_} = useLingui();
  const toasts = useToasts();
  const {id, events, target} = goal;
  const [mode, setMode] = useState<OffcanvasMode>('closed');
  const [isExploding, setIsExploding] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element>(
    document.fullscreenElement ?? document.body,
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setPortalContainer(document.fullscreenElement ?? document.body);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const offcanvasReference = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        offcanvasReference.current &&
        !offcanvasReference.current.contains(event.target as Node) &&
        mode !== 'closed'
      ) {
        setMode('closed');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mode]);

  const handleGoalReset = () => {
    setGoal({
      ...goal,
      events: [],
    });
    setIsExploding(false);
  };

  const createGoalMutation = useCreateStrengthGoalMutation();

  const onCreateEvent = async () => {
    const updatedGoal = {
      ...goal,
      events: [...goal.events, {createdAt: new Date().toJSON()}],
    };

    if (updatedGoal.events.length === goal.target) {
      updatedGoal.completedCount++;
      try {
        await createGoalMutation.mutateAsync({
          pathParameters: {id: goal.group.id},
          payload: updatedGoal,
        });
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while creating the goal`),
        });
      }
    }

    setGoal(updatedGoal);
  };

  return (
    <>
      {createPortal(
        <OffcanvasFloatingButton
          mode={mode}
          strength={goal.strength}
          completedCount={goal.completedCount}
          events={events}
          target={target}
          isExploding={isExploding}
          setIsExploding={setIsExploding}
          goalButtonSize={goalButtonSize}
          id={id}
          onClick={() => {
            if (goal.events.length >= goal.target) {
              handleGoalReset();
            }

            setMode('small');
          }}
        />,
        portalContainer,
      )}
      <OffcanvasGoal
        closeIcon="minimize"
        mode={mode}
        setMode={setMode}
        goal={goal}
        onCreateEvent={onCreateEvent}
      />
    </>
  );
}
