/* eslint-disable @typescript-eslint/naming-convention */
import {useState} from 'react';
import {i18n} from '@lingui/core';
import {Stack, Card} from 'react-bootstrap';
import {type LanguageCode} from '@client/ApiTypes';
import {Trans} from '@lingui/react/macro';
import GoalProgressbar from '@/components/ui/StrengthGoal/GoalProgressbar.js';
import GoalTrophy from '@/components/ui/StrengthGoal/GoalTrophy.js';
import TimeLeft from '@/components/ui/StrengthGoal/TimeLeft.js';
import {
  strengthColorMap,
  strengthExamplesMap,
  strengthTranslationMap,
} from '@/helpers/strengths.js';
import bling from '@/components/ui/StrengthGoal/bling.mp3';
import celebration from '@/components/ui/StrengthGoal/celebration.mp3';

const ARROW_SIZE_PX = 12;
const ARROW_TIP_OFFSET_PX = ARROW_SIZE_PX / Math.SQRT2;
const GOAL_ARROW_BOX_OFFSET_PX = 6;
const GOAL_TIP_BELOW_BOTTOM_PX = ARROW_TIP_OFFSET_PX - GOAL_ARROW_BOX_OFFSET_PX;

const clickSound = typeof Audio === 'undefined' ? undefined : new Audio(bling);
const completeSound =
  typeof Audio === 'undefined' ? undefined : new Audio(celebration);

export default function GoalsDemo({
  onDone,
  onBusy,
}: {
  readonly onDone: () => void;
  readonly onBusy: (busy: boolean) => void;
}) {
  const {locale} = i18n;
  const [events, setEvents] = useState<Array<{createdAt: string}>>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleGoalClick = async () => {
    if (events.length >= 3) return;
    onBusy(true);
    try {
      await clickSound?.play();
      setEvents((previous) => [
        ...previous,
        {createdAt: new Date().toISOString()},
      ]);
      setIsExploding(true);

      if (events.length + 1 >= 3) {
        setIsCompleted(true);
        await completeSound?.play();
        setTimeout(() => {
          onDone();
        }, 3000);
      }
    } finally {
      onBusy(false);
    }
  };

  return (
    <Stack className="align-items-start gap-3 flex-column flex-md-row p-4 pb-0 overflow-hidden">
      <div className="flex-grow-1">
        <p>
          <Trans>
            The Goal Setting Tool helps your group practice a chosen strength.
          </Trans>
        </p>
        <ul className="ps-3">
          <li>
            <Trans>Choose the strength you want to work on.</Trans>
          </li>
          <li>
            <Trans>Click the goal to record your group’s progress.</Trans>
          </li>
          <li>
            <Trans>When the goal is achieved, you’ll earn a badge.</Trans>
          </li>
        </ul>
        <p>
          <Trans>
            Invite your students to see the good and click the goal setting tool
            together. It motivates the whole group to practice.
          </Trans>
        </p>
        <p>
          <Trans>
            Try it now: press the button <strong>three times</strong>!
          </Trans>
        </p>
      </div>

      <div className="w-100 w-md-auto d-flex justify-content-center">
        <Card className="mb-3" style={{width: 260}}>
          <Card.Header
            style={{
              backgroundColor: strengthColorMap.curiosity[300],
              border: 0,
            }}
          >
            <div className="fw-bold fs-6">
              {strengthTranslationMap.curiosity[locale as LanguageCode]}
            </div>
            <div className="fw-bold fs-xs">
              {isCompleted ? (
                <Trans>Completed 1 time</Trans>
              ) : (
                <TimeLeft
                  targetDate={new Date(Date.now() + 1000 * 60 * 5).toJSON()}
                />
              )}
            </div>
          </Card.Header>

          <Card.Body
            className="text-center pt-3 px-3"
            style={{backgroundColor: strengthColorMap.curiosity[100]}}
          >
            <div className="d-flex flex-column align-items-center gap-3">
              <div>
                {isCompleted ? (
                  <div style={{position: 'relative', width: 180, height: 180}}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '78%',
                        left: '78%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }}
                    >
                      <GoalTrophy completedCount={1} size={80} />
                    </div>
                    <GoalProgressbar
                      isAnimated
                      strength="curiosity"
                      events={events}
                      target={3}
                      isExploding={isExploding}
                      setIsExploding={setIsExploding}
                      size={180}
                    />
                  </div>
                ) : (
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <div style={{cursor: 'pointer'}} onClick={handleGoalClick}>
                      <GoalProgressbar
                        isAnimated
                        strength="curiosity"
                        events={events}
                        target={3}
                        isExploding={isExploding}
                        setIsExploding={setIsExploding}
                        size={180}
                      />
                    </div>

                    {!isCompleted && events.length === 0 && (
                      <div
                        className="wizard-tooltip tooltip-bounce-y"
                        style={{
                          left: '50%',
                          top: 0,
                          transform:
                            'translate(-50%, calc(-100% + 40px + var(--bounce-y)))',
                          transformOrigin: `50% calc(100% + ${GOAL_TIP_BELOW_BOTTOM_PX}px)`,
                        }}
                      >
                        <Trans>Click me!</Trans>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: -GOAL_ARROW_BOX_OFFSET_PX,
                            left: '50%',
                            transform: 'translateX(-50%) rotate(45deg)',
                            width: ARROW_SIZE_PX,
                            height: ARROW_SIZE_PX,
                            background: 'var(--bs-primary)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center text-break my-2 fs-6">
                {strengthExamplesMap.curiosity[locale as LanguageCode]}.
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Stack>
  );
}
