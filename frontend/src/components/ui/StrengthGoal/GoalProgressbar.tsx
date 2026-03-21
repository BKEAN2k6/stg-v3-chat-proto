import {useState, useEffect, useRef, useMemo} from 'react';
import clsx from 'clsx';
import {Badge} from 'react-bootstrap';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {type StrengthSlug} from '@client/ApiTypes';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './GoalProgressbar.scss';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';
import ConfettiExplosion from '@/components/ui/ConfettiExplosion/index.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly events: Array<{createdAt: string}>;
  readonly target: number;
  readonly isExploding?: boolean;
  readonly setIsExploding?: (value: boolean) => void;
  readonly size: number;
  readonly isAnimated?: boolean;
};

export default function GoalProgressbar({
  strength,
  events,
  target,
  isExploding,
  setIsExploding,
  size = 160,
  isAnimated = false,
}: Properties) {
  const [progress, setProgress] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(3);
  const isFirstRender = useRef(true);
  const {_} = useLingui();
  const [greeting, setGreeting] = useState('');
  const greetings = useMemo(
    () => [
      _(msg`OK!`),
      _(msg`Good!`),
      _(msg`Great!`),
      _(msg`The Best!`),
      _(msg`Awesome!`),
      _(msg`Brilliant!`),
      _(msg`Magnificent!`),
      _(msg`Perfect!`),
    ],
    [_],
  );

  useEffect(() => {
    if (isExploding) {
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }
  }, [isExploding, greetings, _]);

  useEffect(() => {
    if (isFirstRender.current) {
      const progressTimer = setTimeout(() => {
        setProgress((events.length / target) * 100);
      }, 100);
      const transitionTimer = setTimeout(() => {
        setTransitionDuration(0.5);
        isFirstRender.current = false;
      }, 3100);

      return () => {
        clearTimeout(progressTimer);
        clearTimeout(transitionTimer);
      };
    }

    setProgress((events.length / target) * 100);
  }, [events.length, target]);

  const backgroundColor = strengthColorMap[strength][300];
  const borderColor = strengthColorMap[strength][500];

  const randomAnimation = useMemo(() => {
    const explosionAnimations = [
      'roll-away-right',
      'roll-away-left',
      'explode',
      'flip-vertical',
      'skew-frenzy',
      'hyper-spin',
      'flip-fall',
      'slide-return-right',
      'slide-return-left',
      'flip-bounce',
    ];

    return isExploding
      ? explosionAnimations[
          Math.floor(Math.random() * explosionAnimations.length)
        ]
      : '';
  }, [isExploding]);

  return (
    <div style={{width: size, height: size, position: 'relative'}}>
      <CircularProgressbarWithChildren
        value={progress}
        styles={buildStyles({
          pathColor: '#7754c9',
          trailColor: '#fff',
          rotation: 0.5,
          pathTransitionDuration: transitionDuration,
        })}
      >
        {greeting ? (
          <div
            className="greeting-animation"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              fontWeight: 'bold',
              fontSize: '4rem',
              lineHeight: 1,
              WebkitTextStroke: '1px black',
              color: '#fff',
              pointerEvents: 'none',
            }}
            onAnimationEnd={() => {
              setGreeting('');
            }}
          >
            {greeting}
          </div>
        ) : null}
        {isExploding ? (
          <ConfettiExplosion
            zIndex={10_005}
            onComplete={() => {
              if (setIsExploding) setIsExploding(false);
            }}
          />
        ) : null}
        <div
          className="shadow-md rounded-circle w-100 h-100"
          style={{
            position: 'relative',
            border: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '84%',
              height: '84%',
              borderRadius: '50%',
            }}
          >
            {isAnimated ? (
              <SimpleLottiePlayer
                autoplay
                loop
                className={clsx('goal-button', isExploding && randomAnimation)}
                src={`/animations/strengths/${strength}.json`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor,
                  cursor: 'pointer',
                }}
              />
            ) : (
              <img
                className={clsx('goal-button', isExploding && randomAnimation)}
                src={`/images/strengths/${strength}.png`}
                alt={strength}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor,
                }}
              />
            )}
          </div>
        </div>
        <Badge
          pill
          bg="light"
          text="primary"
          style={{
            boxShadow: '0 0 0.3rem rgba(0, 0, 0, 0.12)',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: size * 0.05,
            paddingBottom: size * 0.03,
            width: size * 0.4,
            fontSize: size * 0.1,
          }}
        >
          {events.length} / {target}
        </Badge>
      </CircularProgressbarWithChildren>
    </div>
  );
}
