import {useEffect, useState} from 'react';
import {Trans, Plural} from '@lingui/react/macro';
import {Card} from 'react-bootstrap';
import {type StrengthSlug} from '@client/ApiTypes';
import GoalControls from './GoalControls.js';
import GoalProgressbar from './GoalProgressbar.js';
import GoalTrophy from './GoalTrophy.js';
import TimeLeft from './TimeLeft.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly id: string;
  readonly description: string;
  readonly title: string;
  readonly strength: StrengthSlug;
  readonly events: Array<{
    createdAt: string;
  }>;
  readonly target: number;
  readonly targetDate: string;
  readonly completedCount: number;
  readonly trophyDelay?: number;
  readonly isAnimated?: boolean;
  readonly descriptionHeight?: number;
  readonly onGoalRemove?: () => void;
  readonly onGoalEdit?: () => void;
  readonly onGoalRedo?: () => void;
  readonly isCompletionStatusHidden?: boolean;
  readonly isDescriptionHidden?: boolean;
};

const size = 180;

export default function GoalCardContent(properties: Properties) {
  const {
    description,
    title,
    strength,
    events,
    target,
    targetDate,
    completedCount,
    trophyDelay,
    isAnimated,
    descriptionHeight,
    onGoalRemove,
    onGoalEdit,
    onGoalRedo,
    isCompletionStatusHidden,
    isDescriptionHidden,
  } = properties;
  const darkerColor = strengthColorMap[strength][300];
  const lighterColor = strengthColorMap[strength][100];
  const borderColor = strengthColorMap[strength][500];
  const isCompleted = events.length >= target;
  const [isTrophyShown, setIsTrophyShown] = useState<boolean>(false);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        setIsTrophyShown(true);
      }, trophyDelay);
    }
  }, [isCompleted, trophyDelay]);

  return (
    <>
      <Card.Header style={{backgroundColor: darkerColor, border: 0}}>
        <div className="fw-bold fs-6">{title}</div>
        {!isCompletionStatusHidden && (
          <div className="fw-bold fs-xs">
            {isCompleted ? (
              <Trans>
                Completed{' '}
                <Plural value={completedCount} one="# time" other="# times" />
              </Trans>
            ) : (
              <TimeLeft targetDate={targetDate} />
            )}
          </div>
        )}
      </Card.Header>

      <Card.Body
        className="text-center pt-3 px-3"
        style={{backgroundColor: lighterColor}}
      >
        <div className="d-flex flex-column align-items-center gap-3">
          <div style={{width: '100%', maxWidth: size, aspectRatio: '1'}}>
            {isCompleted ? (
              <div
                style={{position: 'relative', width: '100%', height: '100%'}}
              >
                {isTrophyShown ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '78%',
                      left: '78%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                    }}
                  >
                    <GoalTrophy
                      completedCount={completedCount}
                      isAnimated={isAnimated}
                      size={80}
                    />
                  </div>
                ) : null}
                <img
                  className="rounded-circle shadow-md w-100 h-100"
                  src={`/images/strengths/${strength}.png`}
                  alt={strength}
                  style={{
                    backgroundColor: darkerColor,
                    border: `8px solid ${borderColor}`,
                  }}
                />
              </div>
            ) : (
              <GoalProgressbar
                strength={strength}
                events={events}
                target={target}
                size={size}
                isAnimated={isAnimated}
              />
            )}
          </div>
          {!isDescriptionHidden && (
            <div
              className="d-flex align-items-center text-break"
              style={{height: descriptionHeight}}
            >
              {description}
            </div>
          )}
        </div>
      </Card.Body>

      {!(!onGoalRemove && !onGoalEdit && !onGoalRedo) && (
        <Card.Footer style={{backgroundColor: lighterColor, border: 0}}>
          <GoalControls
            onGoalRemove={onGoalRemove}
            onGoalEdit={onGoalEdit}
            onGoalRedo={onGoalRedo}
          />
        </Card.Footer>
      )}
    </>
  );
}
