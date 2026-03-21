// forked from https://github.com/muhashi/react-confetti-blast (MIT)

import * as React from 'react';
import {createPortal} from 'react-dom';
import useConfettiStyles, {type Particle} from './styles.js';

export type ConfettiProperties = {
  readonly particleCount?: number;
  readonly duration?: number;
  readonly colors?: string[];
  readonly particleSize?: number;
  readonly force?: number;
  readonly height?: number | string;
  readonly width?: number;
  readonly zIndex?: number;
  readonly onComplete?: () => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>;

const createParticles = (count: number, colors: string[]): Particle[] => {
  const increment = 360 / count;
  return Array.from({length: count}, (_, i) => i).map((index) => ({
    color: colors[index % colors.length],
    degree: increment * index,
  }));
};

const defaultColors = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'];

function ConfettiExplosion({
  particleCount = 100,
  duration = 2200,
  colors = defaultColors,
  particleSize = 12,
  force = 0.5,
  height = '120vh',
  width = 1000,
  zIndex,
  onComplete,
  ...properties
}: ConfettiProperties) {
  const [origin, setOrigin] = React.useState<{top: number; left: number}>();
  const [isActive, setIsActive] = React.useState(true);
  const particles = React.useMemo(
    () => createParticles(particleCount, colors),
    [particleCount, colors],
  );

  const classes = useConfettiStyles({
    particles,
    duration,
    particleSize,
    force,
    width,
    height,
  });

  const originReference = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      const {top, left} = node.getBoundingClientRect();
      setOrigin({top, left});
    }
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsActive(false);
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, duration);
    return () => {
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <div ref={originReference} className={classes.container} {...properties}>
      {origin && isActive
        ? createPortal(
            <div
              className={classes.screen}
              {...(zIndex ? {style: {zIndex}} : null)}
            >
              <div
                style={{
                  position: 'absolute',
                  top: origin.top,
                  left: origin.left,
                }}
              >
                {particles.map((particle, i) => (
                  <div key={particle.degree} className={classes.particle(i)}>
                    <div />
                  </div>
                ))}
              </div>
            </div>,
            document.fullscreenElement ?? document.body,
          )
        : null}
    </div>
  );
}

export default ConfettiExplosion;
