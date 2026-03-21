import {useState, useEffect, useRef, useCallback} from 'react';
import OffcanvasHeader from './OffcanvasHeader.js';
import OffcanvasContent from './OffcanvasContent.js';
import {type OffcanvasMode} from './OffcanvasMode.js';
import bling from './bling.mp3';
import {type GroupedGoal} from '@/components/ui/StrengthGoal/useGroupedGoals.js';
import {strengthColorMap} from '@/helpers/strengths.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useAiGuidance} from '@/context/aiGuidanceContext.js';
import {track} from '@/helpers/analytics.js';
import useBreakpoint from '@/hooks/useBreakpoint.js';

const sidebarSize = 250;
const expandedSize = 375;
const clickSound = new Audio(bling);

type Properties = {
  readonly mode: OffcanvasMode;
  readonly setMode: (mode: OffcanvasMode) => void;
  readonly goal: GroupedGoal;
  readonly onCreateEvent: () => void;
  readonly targetDate?: string;
  readonly closeIcon: 'close' | 'minimize';
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  readonly toggleRef?: React.RefObject<HTMLElement | null>;
};

function useOutsideClick(
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  reference: React.RefObject<HTMLElement | null>,
  callback: () => void,
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  toggleReference?: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggleReference?.current?.contains(event.target as Node)) return;
      if (
        reference.current &&
        !reference.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reference, callback, toggleReference]);
}

export default function OffcanvasGoal({
  goal,
  mode,
  setMode,
  onCreateEvent,
  targetDate,
  closeIcon,
  toggleRef,
}: Properties) {
  const {currentUser} = useCurrentUser();
  const aiGuidance = useAiGuidance();
  const breakpoint = useBreakpoint();
  const {id, group, description, title, events, target} = goal;

  const [isExploding, setIsExploding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hadProgressThisSession, setHadProgressThisSession] = useState(false);
  const offcanvasReference = useRef<HTMLDivElement>(null);

  const setOffcanvasMode = useCallback(
    (newMode: OffcanvasMode) => {
      if (newMode === 'closed') {
        if (hadProgressThisSession && group.id) {
          aiGuidance.invalidate(group.id);
        }

        setHadProgressThisSession(false);
        setIsCompleted(false);
        setIsExploding(false);
      }

      setMode(newMode);
    },
    [setMode, hadProgressThisSession, group.id, aiGuidance],
  );

  useEffect(() => {
    setIsCompleted(false);
    setIsExploding(false);
    setHadProgressThisSession(false);
  }, [goal.id]);

  useOutsideClick(
    offcanvasReference,
    () => {
      if (mode !== 'closed') setOffcanvasMode('closed');
    },
    toggleRef,
  );

  const handleClick = async () => {
    if (events.length >= target) return;

    setIsExploding(false);
    setHadProgressThisSession(true);

    track('Goal clicked');
    await clickSound.play();
    onCreateEvent();

    if (events.length + 1 >= target) {
      track('Goal completed');
      const isAlreadyExpanded = mode === 'expanded';
      setOffcanvasMode('expanded');
      const delay = isAlreadyExpanded ? 0 : 300;
      setTimeout(() => {
        setIsExploding(true);
      }, delay);
      setTimeout(() => {
        setIsCompleted(true);
      }, delay + 3000);
    } else {
      setIsExploding(true);
    }
  };

  if (!currentUser) return null;

  return (
    <div
      ref={offcanvasReference}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: mode === 'expanded' ? '100%' : '360px',
        transform: mode === 'closed' ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease-in-out, width 0.3s ease-in-out',
        zIndex: 10_000,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        backgroundColor: strengthColorMap[goal.strength][100],
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <OffcanvasHeader
        mode={mode}
        setMode={setOffcanvasMode}
        isExpanding={Boolean(group.name)}
        isExpandingDisabled={isCompleted}
        title={group.name}
        closeIcon={closeIcon}
        strength={goal.strength}
      />

      <OffcanvasContent
        isCompleted={isCompleted}
        title={title}
        description={description}
        size={
          mode === 'expanded' && breakpoint !== 'xs'
            ? expandedSize
            : sidebarSize
        }
        strength={goal.strength}
        events={events}
        target={target}
        targetDate={targetDate}
        isExploding={isExploding}
        setIsExploding={setIsExploding}
        completedCount={goal.completedCount}
        id={id}
        handleClick={handleClick}
        onClose={() => {
          setOffcanvasMode('closed');
        }}
      />
    </div>
  );
}
