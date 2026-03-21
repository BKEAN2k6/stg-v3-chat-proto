import {useEffect, useRef, useState} from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setReduced(Boolean(m?.matches));
    };

    onChange();
    m?.addEventListener?.('change', onChange);
    return () => {
      m?.removeEventListener?.('change', onChange);
    };
  }, []);
  return reduced;
}

export default function AnimatedBar({
  percentage,
  trackColor,
  fillColor,
  heightPx,
  widthPx,
  delayMs = 0,
  resetKey,
  children,
}: {
  readonly percentage: number;
  readonly trackColor: string | undefined;
  readonly fillColor: string | undefined;
  readonly heightPx: number;
  readonly widthPx: number;
  readonly delayMs?: number;
  readonly resetKey: string | number;
  readonly children?: React.ReactNode;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [h, setH] = useState(0);
  const reference = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setH(0);
    setInView(false);
  }, [resetKey]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setH(percentage);
      return;
    }

    const element = reference.current;
    if (!element) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      {threshold: 0.2},
    );
    io.observe(element);
    return () => {
      io.disconnect();
    };
  }, [prefersReducedMotion, percentage]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setH(percentage);
      return;
    }

    const t = globalThis.setTimeout(() => {
      setH(percentage);
    }, delayMs);
    return () => {
      globalThis.clearTimeout(t);
    };
  }, [inView, percentage, prefersReducedMotion, delayMs]);

  return (
    <div
      ref={reference}
      style={{
        height: heightPx,
        width: widthPx,
        backgroundColor: trackColor,
        borderRadius: '0.25rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${h}%`,
          backgroundColor: fillColor ?? 'rgba(0,0,0,0.3)',
          borderRadius: '0.25rem 0.25rem 0 0',
          border: '3px solid rgba(0,0,0,0.1)',
          transition: prefersReducedMotion
            ? undefined
            : 'height 800ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'height',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
