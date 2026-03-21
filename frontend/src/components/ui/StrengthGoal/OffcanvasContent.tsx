import {type StrengthSlug} from '@client/ApiTypes';
import TimeLeft from './TimeLeft.js';
import GoalEndExreen from './GoalEndScreen.js';
import GoalProgressbar from '@/components/ui/StrengthGoal/GoalProgressbar.js';

type Properties = {
  readonly isCompleted: boolean;
  readonly title: string;
  readonly description: string;
  readonly size: number;
  readonly strength: StrengthSlug;
  readonly events: any[];
  readonly target: number;
  readonly targetDate?: string;
  readonly isExploding: boolean;
  readonly completedCount: number;
  readonly setIsExploding: (value: boolean) => void;
  readonly id: string;
  readonly handleClick: () => void;
  readonly onClose: () => void;
};

export default function OffcanvasContent({
  isCompleted,
  title,
  description,
  size,
  strength,
  events,
  target,
  targetDate,
  isExploding,
  setIsExploding,
  completedCount,
  id,
  handleClick,
  onClose,
}: Properties) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        overflow: 'hidden',
        position: 'relative',
        flex: 1,
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      {isCompleted ? (
        <GoalEndExreen completedCount={completedCount} onClose={onClose} />
      ) : (
        <>
          <h2 className="fs-4 d-none d-xl-block">{title}</h2>
          <p className="mt-0 mb-4 mt-xl-4 mb-xl-5 fw-bold fs-5 fs-lg-4 fs-xl-3">
            {description}
          </p>
          <div
            style={{
              width: size,
              height: size,
              margin: '0 auto 1rem',
              cursor: 'pointer',
            }}
            onClick={handleClick}
          >
            <GoalProgressbar
              key={id}
              isAnimated
              strength={strength}
              events={events}
              target={target}
              isExploding={isExploding}
              setIsExploding={setIsExploding}
              size={size}
            />
          </div>
          {targetDate ? (
            <div className="mt-3">
              <TimeLeft targetDate={targetDate} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
