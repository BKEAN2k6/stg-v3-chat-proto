import React, {type Ref, useEffect, useRef} from 'react';
import lottie, {type AnimationItem} from 'lottie-web/build/player/lottie_light';
import createAudioFactory from './createAudioFactory.js';

export default React.forwardRef(
  (
    {
      animationData,
      onAnimationLoaded,
      isInstanceMuted,
    }: {
      readonly animationData: Record<string, unknown>;
      readonly onAnimationLoaded: (animation: AnimationItem) => void;
      readonly isInstanceMuted: boolean;
    },
    reference: Ref<AnimationItem>,
  ) => {
    const containerReference = useRef<HTMLDivElement>(null);
    const animationReference = useRef<AnimationItem | undefined>(undefined);
    const setMutedReference = useRef<((m: boolean) => void) | undefined>(
      undefined,
    );

    useEffect(() => {
      const {audioFactory, cleanup, setMuted} = createAudioFactory();
      setMutedReference.current = setMuted;
      animationReference.current?.destroy();

      if (containerReference.current) {
        containerReference.current.innerHTML = '';
        const animation = lottie.loadAnimation({
          container: containerReference.current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
          },
          // @ts-expect-error audioFactory injected
          audioFactory,
        });
        animationReference.current = animation;
        onAnimationLoaded(animation);
      }

      return () => {
        animationReference.current?.destroy();
        cleanup();
      };
    }, [animationData, onAnimationLoaded]);

    useEffect(() => {
      if (!animationReference.current) return;
      if (typeof reference === 'function') {
        reference(animationReference.current);
      } else if (reference && 'current' in reference) {
        (reference as React.RefObject<AnimationItem | undefined>).current =
          animationReference.current;
      }
    }, [reference]);

    useEffect(() => {
      setMutedReference.current?.(isInstanceMuted);
    }, [isInstanceMuted]);

    return (
      <div ref={containerReference} className="lottie-animation-container" />
    );
  },
);
