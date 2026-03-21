import {useState, useEffect, useRef} from 'react';
import {useWindowSize} from 'react-use';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// NOTE: make sure these match $grid-breakpoints in index.scss
const resolveBreakpoint = (width: number): Breakpoint => {
  if (width < 390) return 'xs';
  if (width >= 390 && width < 576) return 'sm';
  if (width >= 576 && width < 838) return 'md';
  if (width >= 838 && width < 992) return 'lg';
  if (width >= 992 && width < 1140) return 'xl';
  return 'xxl';
};

export default function useBreakpoint() {
  const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth));
  const {width} = useWindowSize();
  const lockedReference = useRef(false);
  const lastKnown = useRef(size);

  const isIosFullscreenVideoActive = (): boolean => {
    if (document.fullscreenElement) return true;

    // we want to lock the breakpoint while in fullscreen mode
    // safari rezizes the window when entering fullscreen video, which would
    // cause unwanted breakpoint changes
    const videos = document.querySelectorAll<HTMLVideoElement>('video');
    for (const v of videos) {
      // @ts-expect-error private property
      if (v.webkitDisplayingFullscreen === true) return true;
    }

    return false;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = isIosFullscreenVideoActive();
      lockedReference.current = active;
      if (!active) {
        // sync breakpoint immediately after exiting fullscreen
        const w = window.innerWidth;
        const resolved = resolveBreakpoint(w);
        lastKnown.current = resolved;
        setSize(resolved);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener(
      'webkitbeginfullscreen',
      handleFullscreenChange as EventListener,
    );
    document.addEventListener(
      'webkitendfullscreen',
      handleFullscreenChange as EventListener,
    );

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitbeginfullscreen',
        handleFullscreenChange as EventListener,
      );
      document.removeEventListener(
        'webkitendfullscreen',
        handleFullscreenChange as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (lockedReference.current) return;
    const resolved = resolveBreakpoint(width);
    if (resolved !== lastKnown.current) {
      lastKnown.current = resolved;
      setSize(resolved);
    }
  }, [width]);

  return size;
}
