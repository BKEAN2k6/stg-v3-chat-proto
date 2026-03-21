import {useState, useEffect, useRef} from 'react';
import {type StrengthSlug} from '@client/ApiTypes';
import GoalProgressbar from './GoalProgressbar.js';
import './shake.scss';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly events: any[];
  readonly target: number;
  readonly goalButtonSize: number;
};

export default function ArticleProgessGoalButton({
  strength,
  events,
  target,
  goalButtonSize,
}: Properties) {
  const buttonReference = useRef<HTMLDivElement>(null);
  const [isExploding, setIsExploding] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const previousEventsLength = useRef(events.length);

  useEffect(() => {
    if (events.length > previousEventsLength.current) {
      setVisible(true);
      setAnimate(true);
    }

    previousEventsLength.current = events.length;
  }, [events.length]);

  const handleAnimationEnd = () => {
    setAnimate(false);
    setVisible(false);
  };

  const shakeAmoutn = Math.floor((events.length / target) * 10);
  const className = events.length < target ? `shake-${shakeAmoutn}` : 'explode';

  if (!visible) return null;

  return (
    <div
      ref={buttonReference}
      className={`d-none d-lg-block ${className}`}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 10_001,
      }}
    >
      <div
        className={animate ? 'zoom-fade' : ''}
        onAnimationEnd={handleAnimationEnd}
      >
        <div style={{position: 'relative'}}>
          <div
            style={{
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
          >
            <div
              className="rounded-circle"
              style={{
                backgroundColor: strengthColorMap[strength][300],
                border: `1px solid ${strengthColorMap[strength][500]}`,
                cursor: 'pointer',
                pointerEvents: 'auto',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              }}
            >
              <GoalProgressbar
                isAnimated
                strength={strength}
                events={events}
                target={target}
                isExploding={isExploding}
                setIsExploding={setIsExploding}
                size={goalButtonSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
