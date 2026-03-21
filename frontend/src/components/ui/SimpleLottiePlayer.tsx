import lottie, {type AnimationItem} from 'lottie-web/build/player/lottie_light';
import React, {useEffect, useRef} from 'react';
import {useInView} from 'react-cool-inview';

export type Properties = {
  // eslint-disable-next-line react/boolean-prop-naming
  readonly autoplay?: boolean;
  readonly loop?: boolean | number;
  readonly className?: string;
  readonly src: string | Record<string, unknown>;
  readonly style?: React.CSSProperties;
};

export function SimpleLottiePlayer({
  autoplay = false,
  loop = false,
  className,
  src,
  style,
}: Properties) {
  const containerReference = useRef<HTMLDivElement>(null);
  const animationReference = useRef<AnimationItem | undefined>(undefined);
  const {observe, inView} = useInView();

  useEffect(() => {
    let cancelled = false;

    async function loadAnimation() {
      if (!containerReference.current) return;

      animationReference.current?.destroy();
      animationReference.current = undefined;
      containerReference.current.innerHTML = '';

      let animationData: Record<string, unknown> =
        typeof src === 'string' ? {} : src;

      if (typeof src === 'string') {
        try {
          const response = await fetch(src);
          if (!response.ok) throw new Error('Failed to fetch animation');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          animationData = await response.json();
        } catch (error) {
          console.error('Failed to load Lottie animation:', error);
          return;
        }
      }

      if (cancelled) return;

      animationReference.current = lottie.loadAnimation({
        container: containerReference.current,
        renderer: 'svg',
        autoplay,
        loop,
        animationData,
      });
    }

    void loadAnimation();

    return () => {
      cancelled = true;
      animationReference.current?.destroy();
      animationReference.current = undefined;
    };
  }, [src, autoplay, loop]);

  useEffect(() => {
    if (inView) {
      animationReference.current?.play();
    } else {
      animationReference.current?.pause();
    }
  }, [inView, autoplay]);

  return (
    <div
      ref={(element) => {
        if (!element) return;
        containerReference.current = element;
        observe(element);
      }}
      className={className}
      style={style}
    />
  );
}
