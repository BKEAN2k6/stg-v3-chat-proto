import {
  type CSSProperties,
  type UIEvent,
  type MouseEvent,
  type PropsWithChildren,
  useRef,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import {
  type ElementLayout,
  ensureWithinLimits,
  isEventPosOnDomNode,
  isEventPosOnLayout,
} from './utils.js';
import './CustomScroll.scss';

type CustomScrollProps = PropsWithChildren<{
  readonly allowOuterScroll?: boolean;
  readonly heightRelativeToParent?: string;
  readonly onScroll?: (event: UIEvent) => void;
  readonly addScrolledClass?: boolean;
  readonly freezePosition?: boolean;
  readonly handleClass?: string;
  readonly minScrollHandleHeight?: number;
  readonly flex?: string;
  readonly rtl?: boolean;
  readonly scrollTo?: number;
  readonly keepAtBottom?: boolean;
  readonly className?: string;
}>;

export function CustomScroll({
  allowOuterScroll = false,
  heightRelativeToParent,
  onScroll: onScrollProp,
  addScrolledClass = false,
  freezePosition = false,
  handleClass,
  minScrollHandleHeight = 38,
  flex,
  rtl = false,
  scrollTo,
  keepAtBottom = false,
  className,
  children,
}: CustomScrollProps) {
  const [scrollPos, setScrollPos] = useState(0);
  const [onDrag, setOnDrag] = useState(false);
  const [visible, setVisible] = useState(false);
  const hasScrollRef = useRef(false);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const customScrollRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const customScrollbarRef = useRef<HTMLDivElement>(null);
  const scrollHandleRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const scrollbarWidthRef = useRef(0);
  const contentHeightRef = useRef(0);
  const visibleHeightRef = useRef(0);
  const scrollHandleHeightRef = useRef(0);
  const scrollRatioRef = useRef(1);
  const startDragHandlePosRef = useRef(0);
  const startDragMousePosRef = useRef(0);
  const previousScrollToRef = useRef<number | undefined>(scrollTo);
  const previousScrollPosRef = useRef(0);

  const getScrolledElement = useCallback(
    () => innerContainerRef.current as HTMLElement,
    [],
  );

  const updateScrollPosition = useCallback((scrollValue: number) => {
    const innerContainer = innerContainerRef.current;
    if (!innerContainer) return;

    const updatedScrollTop = ensureWithinLimits(
      scrollValue,
      0,
      contentHeightRef.current - visibleHeightRef.current,
    );
    innerContainer.scrollTop = updatedScrollTop;
    setScrollPos(updatedScrollTop);
  }, []);

  const getScrollHandleStyle = useCallback((): {
    height: number;
    top: number;
  } => {
    const handlePosition = scrollPos * scrollRatioRef.current;
    scrollHandleHeightRef.current =
      visibleHeightRef.current * scrollRatioRef.current;
    return {
      height: scrollHandleHeightRef.current,
      top: handlePosition,
    };
  }, [scrollPos]);

  const enforceMinHandleHeight = useCallback(
    (calculatedStyle: {height: number; top: number}) => {
      if (calculatedStyle.height >= minScrollHandleHeight) {
        return calculatedStyle;
      }

      const diffHeightBetweenMinAndCalculated =
        minScrollHandleHeight - calculatedStyle.height;
      const scrollPositionToAvailableScrollRatio =
        scrollPos / (contentHeightRef.current - visibleHeightRef.current);
      const scrollHandlePosAdjustmentForMinHeight =
        diffHeightBetweenMinAndCalculated *
        scrollPositionToAvailableScrollRatio;
      const handlePosition =
        calculatedStyle.top - scrollHandlePosAdjustmentForMinHeight;

      return {
        height: minScrollHandleHeight,
        top: handlePosition,
      };
    },
    [minScrollHandleHeight, scrollPos],
  );

  const getScrollValueFromHandlePosition = useCallback(
    (handlePosition: number) => handlePosition / scrollRatioRef.current,
    [],
  );

  const isMouseEventOnScrollHandle = useCallback((event: MouseEvent) => {
    if (!scrollHandleRef.current) {
      return false;
    }

    return isEventPosOnDomNode(event, scrollHandleRef.current);
  }, []);

  const isMouseEventOnCustomScrollbar = useCallback(
    (event: MouseEvent) => {
      if (!customScrollbarRef.current || !customScrollRef.current) {
        return false;
      }

      const boundingRect = customScrollRef.current.getBoundingClientRect();
      const customScrollbarBoundingRect =
        customScrollbarRef.current.getBoundingClientRect();
      const horizontalClickArea = rtl
        ? {
            left: boundingRect.left,
            right: customScrollbarBoundingRect.right,
          }
        : {
            left: customScrollbarBoundingRect.left,
            width: boundingRect.right,
          };
      const customScrollbarLayout: ElementLayout = {
        right: boundingRect.right,
        top: boundingRect.top,
        height: boundingRect.height,
        ...horizontalClickArea,
      };

      return isEventPosOnLayout(event, customScrollbarLayout);
    },
    [rtl],
  );

  const calculateNewScrollHandleTop = useCallback(
    (clickEvent: MouseEvent) => {
      const domNode = customScrollRef.current;
      if (!domNode) return 0;

      const boundingRect = domNode.getBoundingClientRect();
      const currentTop = boundingRect.top + window.pageYOffset;
      const clickOffsetFromTop = clickEvent.pageY - currentTop;
      const scrollHandleTop = getScrollHandleStyle().top;
      const isBelowHandle =
        clickOffsetFromTop > scrollHandleTop + scrollHandleHeightRef.current;

      if (isBelowHandle) {
        return (
          scrollHandleTop +
          Math.min(
            scrollHandleHeightRef.current,
            visibleHeightRef.current - scrollHandleHeightRef.current,
          )
        );
      }

      return scrollHandleTop - Math.max(scrollHandleHeightRef.current, 0);
    },
    [getScrollHandleStyle],
  );

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (
        !hasScrollRef.current ||
        !isMouseEventOnCustomScrollbar(event) ||
        isMouseEventOnScrollHandle(event)
      ) {
        return;
      }

      const newScrollHandleTop = calculateNewScrollHandleTop(event);
      const newScrollValue =
        getScrollValueFromHandlePosition(newScrollHandleTop);
      updateScrollPosition(newScrollValue);
    },
    [
      isMouseEventOnCustomScrollbar,
      isMouseEventOnScrollHandle,
      calculateNewScrollHandleTop,
      getScrollValueFromHandlePosition,
      updateScrollPosition,
    ],
  );

  const handleScroll = useCallback(
    (event: UIEvent) => {
      if (freezePosition) {
        return;
      }

      setScrollPos(event.currentTarget.scrollTop);
      onScrollProp?.(event);
    },
    [freezePosition, onScrollProp],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!hasScrollRef.current || !isMouseEventOnScrollHandle(event)) {
        return;
      }

      startDragHandlePosRef.current = getScrollHandleStyle().top;
      startDragMousePosRef.current = event.pageY;
      setOnDrag(true);
    },
    [isMouseEventOnScrollHandle, getScrollHandleStyle],
  );

  const handleTouchStart = useCallback(() => {
    setOnDrag(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  // Handle drag events
  useEffect(() => {
    if (!onDrag) return;

    const handleDrag = (event: globalThis.MouseEvent) => {
      event.preventDefault();
      const mouseDeltaY = event.pageY - startDragMousePosRef.current;
      const handleTopPosition = ensureWithinLimits(
        startDragHandlePosRef.current + mouseDeltaY,
        0,
        visibleHeightRef.current - scrollHandleHeightRef.current,
      );
      const newScrollValue =
        getScrollValueFromHandlePosition(handleTopPosition);
      updateScrollPosition(newScrollValue);
    };

    const handleDragEnd = (event: globalThis.MouseEvent) => {
      event.preventDefault();
      setOnDrag(false);
    };

    document.addEventListener('mousemove', handleDrag, {passive: false});
    document.addEventListener('mouseup', handleDragEnd, {passive: false});

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [onDrag, getScrollValueFromHandlePosition, updateScrollPosition]);

  // Handle scrollTo on mount and changes
  useEffect(() => {
    if (scrollTo === undefined) {
      previousScrollToRef.current = scrollTo;
      return;
    }

    // Update on mount or when scrollTo changes
    if (
      previousScrollToRef.current === undefined ||
      scrollTo !== previousScrollToRef.current
    ) {
      updateScrollPosition(scrollTo);
    }

    previousScrollToRef.current = scrollTo;
  }, [scrollTo, updateScrollPosition]);

  // Update measurements and toggle scroll
  useEffect(() => {
    const innerContainer = getScrolledElement();
    if (!innerContainer) return;

    const previousScrollPos = previousScrollPosRef.current;
    const previousContentHeight = contentHeightRef.current;
    const previousVisibleHeight = visibleHeightRef.current;
    const reachedBottomOnPreviousRender =
      previousScrollPos >= previousContentHeight - previousVisibleHeight;

    contentHeightRef.current = innerContainer.scrollHeight;
    scrollbarWidthRef.current =
      innerContainer.offsetWidth - innerContainer.clientWidth;
    visibleHeightRef.current = innerContainer.clientHeight;
    scrollRatioRef.current = contentHeightRef.current
      ? visibleHeightRef.current / contentHeightRef.current
      : 1;

    const shouldHaveScroll =
      contentHeightRef.current - visibleHeightRef.current > 1;
    if (hasScrollRef.current !== shouldHaveScroll) {
      hasScrollRef.current = shouldHaveScroll;
      forceRender();
    }

    // Only keep at bottom if scrollPos didn't change (external render)
    const isExternalRender = scrollPos === previousScrollPosRef.current;
    if (keepAtBottom && isExternalRender && reachedBottomOnPreviousRender) {
      updateScrollPosition(contentHeightRef.current - visibleHeightRef.current);
    }

    previousScrollPosRef.current = scrollPos;
  });

  // Handle freeze position
  useEffect(() => {
    const contentWrapper = contentWrapperRef.current;
    const innerContainer = getScrolledElement();
    if (!contentWrapper || !innerContainer) return;

    if (freezePosition) {
      contentWrapper.scrollTop = scrollPos;
    }
  }, [freezePosition, scrollPos, getScrolledElement]);

  const scrollSize = scrollbarWidthRef.current || 20;
  const marginKey = rtl ? 'marginLeft' : 'marginRight';

  const innerContainerStyle: CSSProperties = {
    height: (heightRelativeToParent ?? flex) ? '100%' : '',
    overscrollBehavior: allowOuterScroll ? 'auto' : 'none',
    [marginKey]: -1 * scrollSize,
  };

  const contentWrapperStyle: CSSProperties = {
    height: (heightRelativeToParent ?? flex) ? '100%' : '',
    overflowY: freezePosition ? 'hidden' : 'visible',
    [marginKey]: scrollbarWidthRef.current ? 0 : scrollSize,
  };

  const outerContainerStyle: CSSProperties = {
    height: (heightRelativeToParent ?? flex) ? '100%' : '',
  };

  const rootStyle: CSSProperties = {};
  if (heightRelativeToParent) {
    rootStyle.height = heightRelativeToParent;
  } else if (flex) {
    rootStyle.flex = flex;
  }

  const scrollHandleStyle = enforceMinHandleHeight(getScrollHandleStyle());

  const rootClassName = [
    className ?? '',
    'rcs-custom-scroll',
    onDrag ? 'rcs-scroll-handle-dragged' : '',
  ].join(' ');

  const innerContainerClassName =
    scrollPos && addScrolledClass
      ? 'rcs-inner-container rcs-content-scrolled'
      : 'rcs-inner-container';

  return (
    <div ref={customScrollRef} className={rootClassName} style={rootStyle}>
      <div
        data-testid="outer-container"
        className="rcs-outer-container"
        style={outerContainerStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasScrollRef.current ? (
          <div className="rcs-positioning">
            <div
              ref={customScrollbarRef}
              data-testid="custom-scrollbar"
              className={`rcs-custom-scrollbar ${rtl ? 'rcs-custom-scrollbar-rtl' : ''} ${visible ? 'scroll-visible' : ''}`}
            >
              <div
                ref={scrollHandleRef}
                data-testid="custom-scroll-handle"
                className="rcs-custom-scroll-handle"
                style={scrollHandleStyle}
              >
                <div className={handleClass ?? 'rcs-inner-handle'} />
              </div>
            </div>
          </div>
        ) : null}
        <div
          ref={innerContainerRef}
          data-testid="inner-container"
          className={innerContainerClassName}
          style={innerContainerStyle}
          onScroll={handleScroll}
        >
          <div ref={contentWrapperRef} style={contentWrapperStyle}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
