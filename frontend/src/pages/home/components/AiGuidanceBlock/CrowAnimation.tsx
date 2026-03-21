import {useEffect, useRef, useCallback} from 'react';
import lottie, {type AnimationItem} from 'lottie-web/build/player/lottie_light';

// Animation segment frame boundaries (from loading.json markers)
const introSegment = {start: 0, end: 246} as const;

const idleSegments = [
  {start: 246, end: 306},
  {start: 306, end: 374},
] as const;

const loadingSegments = [
  {start: 374, end: 449},
  {start: 449, end: 511},
  {start: 511, end: 574},
] as const;

const loadingEndSegment = {start: 574, end: 595} as const;
const speakSegment = {start: 595, end: 712} as const;
const endSegment = {start: 712, end: 735} as const;

const frameRate = 30;
const speakDurationSec = (speakSegment.end - speakSegment.start) / frameRate;

export type AnimPhase =
  | 'intro'
  | 'loading'
  | 'loadingEnd'
  | 'speaking'
  | 'ending'
  | 'idle';

// Stub: simulates fetching TTS audio and returning duration in seconds.
// Will be replaced with a real API call later.
async function fetchSpeechAudioDuration(): Promise<number> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 100);
  });
  return 5 + Math.random() * 20;
}

export default function CrowAnimation({
  isLoading,
  className,
  onPhaseChange,
}: {
  readonly isLoading: boolean;
  readonly className?: string;
  readonly onPhaseChange?: (phase: AnimPhase) => void;
}) {
  const animPhaseRef = useRef<AnimPhase>('intro');
  const animRef = useRef<AnimationItem | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const subIndexRef = useRef(0);
  const speakCountRef = useRef(0);
  const speakTargetRef = useRef(1);
  const pendingTransitionRef = useRef<'speaking' | 'loading' | undefined>(
    undefined,
  );
  const rafIdRef = useRef<number | undefined>(undefined);
  const previousFrameRef = useRef(0);

  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

  const setPhase = useCallback((phase: AnimPhase) => {
    animPhaseRef.current = phase;
    onPhaseChangeRef.current?.(phase);
  }, []);

  const poll = useCallback(() => {
    const anim = animRef.current;
    if (!anim) return;

    const frame = anim.currentFrame;
    const previousFrame = previousFrameRef.current;
    previousFrameRef.current = frame;

    // Detect lottie loop wrap-around (ending segment ends at animation op)
    const wrapped =
      animPhaseRef.current === 'ending' && frame < previousFrame - 10;

    const phase = animPhaseRef.current;
    const idx = subIndexRef.current;

    let currentEnd: number;

    switch (phase) {
      case 'intro': {
        currentEnd = introSegment.end;
        break;
      }

      case 'loading': {
        currentEnd = loadingSegments[idx].end;
        break;
      }

      case 'loadingEnd': {
        currentEnd = loadingEndSegment.end;
        break;
      }

      case 'idle': {
        currentEnd = idleSegments[idx].end;
        break;
      }

      case 'speaking': {
        currentEnd = speakSegment.end;
        break;
      }

      case 'ending': {
        currentEnd = endSegment.end;
        break;
      }
    }

    if (frame >= currentEnd || wrapped) {
      switch (phase) {
        case 'intro': {
          subIndexRef.current = 0;
          setPhase('loading');
          anim.goToAndPlay(loadingSegments[0].start, true);
          break;
        }

        case 'loading': {
          if (pendingTransitionRef.current === 'speaking') {
            pendingTransitionRef.current = undefined;
            speakCountRef.current = 0;
            setPhase('loadingEnd');
            anim.goToAndPlay(loadingEndSegment.start, true);
          } else {
            const nextIdx = (idx + 1) % loadingSegments.length;
            subIndexRef.current = nextIdx;
            anim.goToAndPlay(loadingSegments[nextIdx].start, true);
          }

          break;
        }

        case 'loadingEnd': {
          subIndexRef.current = 0;
          setPhase('speaking');
          anim.goToAndPlay(speakSegment.start, true);
          break;
        }

        case 'speaking': {
          speakCountRef.current += 1;
          if (speakCountRef.current >= speakTargetRef.current) {
            setPhase('ending');
            anim.goToAndPlay(endSegment.start, true);
          } else {
            anim.goToAndPlay(speakSegment.start, true);
          }

          break;
        }

        case 'ending': {
          subIndexRef.current = 0;
          setPhase('idle');
          anim.goToAndPlay(idleSegments[0].start, true);
          break;
        }

        case 'idle': {
          if (pendingTransitionRef.current === 'loading') {
            pendingTransitionRef.current = undefined;
            subIndexRef.current = 0;
            setPhase('loading');
            anim.goToAndPlay(loadingSegments[0].start, true);
          } else {
            const nextIdx = (idx + 1) % idleSegments.length;
            subIndexRef.current = nextIdx;
            anim.goToAndPlay(idleSegments[nextIdx].start, true);
          }

          break;
        }
      }
    }

    rafIdRef.current = requestAnimationFrame(poll);
  }, [setPhase]);

  // Load lottie animation
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current) return;

      const response = await fetch('/animations/other/ai-loading-v2.json');
      if (!response.ok || cancelled) return;
      const animationData = (await response.json()) as Record<string, unknown>;
      if (cancelled || !containerRef.current) return;

      containerRef.current.innerHTML = '';
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        autoplay: false,
        loop: true,
        animationData,
        rendererSettings: {
          viewBoxOnly: true,
          viewBoxSize: '40 70 736 900',
        },
      });

      animRef.current = anim;
      animPhaseRef.current = 'intro';
      subIndexRef.current = 0;
      anim.goToAndPlay(introSegment.start, true);
      rafIdRef.current = requestAnimationFrame(poll);
    }

    void init();

    return () => {
      cancelled = true;
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }

      animRef.current?.destroy();
      animRef.current = undefined;
    };
  }, [poll]);

  // React to isLoading becoming false
  const previousIsLoadingRef = useRef(isLoading);
  useEffect(() => {
    const wasLoading = previousIsLoadingRef.current;
    previousIsLoadingRef.current = isLoading;

    if (wasLoading && !isLoading) {
      const prepareSpeaking = async () => {
        const duration = await fetchSpeechAudioDuration();
        speakTargetRef.current = Math.max(
          1,
          Math.ceil(duration / speakDurationSec),
        );
        pendingTransitionRef.current = 'speaking';
      };

      void prepareSpeaking();
    }
  }, [isLoading]);

  // Trigger loading phase on "new idea" click (isLoading goes true)
  useEffect(() => {
    if (!isLoading) return;
    const phase = animPhaseRef.current;

    if (phase === 'idle') {
      pendingTransitionRef.current = 'loading';
    } else if (phase !== 'loading' && phase !== 'intro') {
      subIndexRef.current = 0;
      setPhase('loading');
      animRef.current?.goToAndPlay(loadingSegments[0].start, true);
    }
  }, [isLoading, setPhase]);

  return <div ref={containerRef} className={className} />;
}
