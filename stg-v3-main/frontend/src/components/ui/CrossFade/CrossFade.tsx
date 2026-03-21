import clsx from 'clsx';
import React, {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import './CrossFade.scss';

type CrossFadeProperties = {
  readonly contentKey: string;
  readonly children: ReactNode;
  readonly duration?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
};

type AnimationState = {
  fromNode: ReactNode | undefined;
  toNode: ReactNode | undefined;
  swapped: boolean;
};

function isDescendant(
  parent: HTMLElement | undefined,
  node: Element | undefined,
): boolean {
  if (!parent || !node) {
    return false;
  }

  return parent.contains(node);
}

export function CrossFade({
  contentKey,
  children,
  duration = 500,
  className,
  style,
}: CrossFadeProperties) {
  const [previousContentKey, setPreviousContentKey] = useState(contentKey);
  const [previousChildren, setPreviousChildren] = useState(children);
  const [animating, setAnimating] = useState(false);

  const firstNode = useRef<HTMLDivElement>(null);
  const secondNode = useRef<HTMLDivElement>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const animationState = useRef<AnimationState>({
    fromNode: undefined,
    toNode: children,
    swapped: false,
  });

  const finishAnimation = useCallback(() => {
    setAnimating(false);

    const {swapped} = animationState.current;
    const kept = (swapped ? firstNode.current : secondNode.current) ?? null;
    const hidden = (swapped ? secondNode.current : firstNode.current) ?? null;

    if (kept) {
      kept.removeAttribute('inert');
      kept.removeAttribute('aria-hidden');
      kept.style.pointerEvents = '';
    }

    if (hidden) {
      hidden.removeAttribute('inert');
      hidden.removeAttribute('aria-hidden');
      hidden.style.pointerEvents = '';
    }

    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = undefined;
    }
  }, []);

  // sync duration to CSS var
  useEffect(() => {
    const root = firstNode.current?.parentElement;
    if (root) root.style.setProperty('--crossfade-duration', `${duration}ms`);
  }, [duration]);

  // start animation
  useEffect(() => {
    if (contentKey !== previousContentKey) {
      animationState.current = {
        fromNode: previousChildren,
        toNode: children,
        swapped: !animationState.current.swapped,
      };

      setAnimating(true);

      const {swapped} = animationState.current;
      const outgoing =
        (swapped ? secondNode.current : firstNode.current) ?? null;
      const incoming =
        (swapped ? firstNode.current : secondNode.current) ?? null;

      if (outgoing) {
        outgoing.setAttribute('inert', '');
        outgoing.setAttribute('aria-hidden', 'true');
        outgoing.style.pointerEvents = 'none';
      }

      const activeElement = document.activeElement as HTMLElement | undefined;
      if (outgoing && isDescendant(outgoing, activeElement)) {
        if (incoming) {
          if (!incoming.hasAttribute('tabindex'))
            incoming.setAttribute('tabindex', '-1');
          (incoming as HTMLElement).focus();
        } else {
          activeElement?.blur();
        }
      }

      if (animationTimer.current) clearTimeout(animationTimer.current);
      animationTimer.current = setTimeout(() => {
        finishAnimation();
      }, duration + 50);
    }
  }, [
    contentKey,
    previousContentKey,
    children,
    previousChildren,
    duration,
    finishAnimation,
  ]);

  useEffect(() => {
    setPreviousChildren(children);
    setPreviousContentKey(contentKey);
    return () => {
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, [children, contentKey]);

  const isAnimating = animating || contentKey !== previousContentKey;
  const {swapped, fromNode, toNode} = animationState.current;

  const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (event.propertyName === 'opacity') {
      finishAnimation();
    }
  };

  return (
    <div className={clsx('cross-fade-container', className)} style={style}>
      <div
        ref={firstNode}
        className={clsx('cross-fade-transition', swapped ? 'to' : 'from')}
        style={{transitionDuration: `${duration}ms`}}
        tabIndex={-1}
        onTransitionEnd={handleTransitionEnd}
      >
        {swapped
          ? isAnimating
            ? toNode
            : children
          : isAnimating
            ? fromNode
            : null}
      </div>

      <div
        ref={secondNode}
        className={clsx('cross-fade-transition', swapped ? 'from' : 'to')}
        style={{transitionDuration: `${duration}ms`}}
        tabIndex={-1}
        onTransitionEnd={handleTransitionEnd}
      >
        {swapped
          ? isAnimating
            ? fromNode
            : null
          : isAnimating
            ? toNode
            : children}
      </div>
    </div>
  );
}
