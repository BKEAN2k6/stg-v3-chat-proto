/* eslint-disable complexity */
import {type CSSProperties} from 'react';
import {clsx} from 'yet-another-react-lightbox';
import './SlideShell.scss';
import './AutoScaleSlide.scss';
import {CustomScroll} from '@/components/ui/CustomScroll/CustomScroll.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';

type AutoScaleProperties = {
  readonly body: string;
  readonly layout?:
    | 'default'
    | 'centered'
    | 'full'
    | 'notes'
    | 'half'
    | 'padRight'
    | 'story'
    | 'media';
  readonly color: string;
  readonly background: string;
  readonly backgroundColor: string;
  readonly paddingTop?: string | number;
  readonly paddingBottom?: string | number;
  readonly paddingLeft?: string | number;
  readonly paddingRight?: string | number;
  readonly isScrollable: boolean;
  readonly slideNumber?: number;
  readonly slideCount?: number;
  readonly onEnded?: () => void;
  readonly isAnimationClickable?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
};

const defaultPaddingTop = 10;
const defaultPaddingBottom = 7;
const defaultPaddingLeft = 7;
const defaultPaddingRight = 7;
const storyPaddingRight = 32;
const centeredPaddingBottom = 10;
const scrollBottomOffset = 4;
const scrollRightOffset = 3.5;
const arrowTopOffset = 4.8;
const arrowBottomOffset = 5.5;
const arrowRightOffset = 0.3;

function toCqw(value: number): string {
  const normalized = Math.abs(value) < 0.0001 ? 0 : Number(value.toFixed(4));
  return `${normalized}cqw`;
}

function toCqh(value: number): string {
  const normalized = Math.abs(value) < 0.0001 ? 0 : Number(value.toFixed(4));
  return `${normalized}cqh`;
}

function resolvePercent(
  override: string | number | undefined,
  fallback: number,
): number {
  if (override === undefined) return fallback;
  if (typeof override === 'number' && Number.isFinite(override)) {
    return override;
  }

  if (typeof override === 'string') {
    const parsed = Number.parseFloat(override);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

export default function AutoScaleSlide({
  body,
  layout = 'default',
  color,
  background = 'default',
  backgroundColor,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  isScrollable = false,
  slideNumber,
  slideCount,
  onEnded,
  isAnimationClickable = true,
  className,
  style,
}: AutoScaleProperties) {
  const padTopPercent = resolvePercent(paddingTop, defaultPaddingTop);
  let padBottomPercent = resolvePercent(paddingBottom, defaultPaddingBottom);
  const padLeftPercent = resolvePercent(paddingLeft, defaultPaddingLeft);
  let padRightPercent = resolvePercent(paddingRight, defaultPaddingRight);

  if (paddingRight === undefined) {
    switch (layout) {
      case 'half': {
        padRightPercent = 50;
        break;
      }

      case 'padRight': {
        padRightPercent = 24;
        break;
      }

      case 'story': {
        padRightPercent = storyPaddingRight;
        break;
      }

      case 'default':
      case 'centered':
      case 'full':
      case 'notes':
      case 'media':
      case undefined: {
        break;
      }
    }
  }

  if (layout === 'centered' && paddingBottom === undefined) {
    padBottomPercent = centeredPaddingBottom;
  }

  const shouldScroll = layout === 'story' || isScrollable;
  if (shouldScroll) {
    if (paddingBottom === undefined) padBottomPercent += scrollBottomOffset;
    if (paddingRight === undefined && layout !== 'story') {
      padRightPercent -= scrollRightOffset;
    }
  }

  const backgroundImageUrl =
    layout === 'story'
      ? '/images/slide-backgrounds/story.jpg'
      : background &&
          !backgroundColor &&
          layout !== 'full' &&
          layout !== 'media'
        ? `/images/slide-backgrounds/${background}.jpg`
        : undefined;

  const slideStyle: CSSProperties = {
    position: 'relative',
    backgroundColor: backgroundColor || 'white',
  };

  const foregroundStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    color,
    ...(layout !== 'full' &&
      layout !== 'media' && {
        paddingTop: toCqh(padTopPercent),
        paddingBottom: toCqh(padBottomPercent),
        paddingLeft: toCqw(padLeftPercent),
        paddingRight: toCqw(padRightPercent),
      }),
    ...(layout === 'centered' && {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }),
  };

  const arrowRight = toCqw(padRightPercent - arrowRightOffset);
  const arrowTop = toCqh(padTopPercent - arrowTopOffset);
  const arrowBottom = toCqh(padBottomPercent - arrowBottomOffset);

  const contentClassName = clsx(
    'slide-content',
    layout === 'story' && 'story-layout',
    layout === 'media' && 'media-layout',
  );

  const content = shouldScroll ? (
    <CustomScroll
      heightRelativeToParent="100%"
      className="slide-scroll-container"
    >
      <>
        <span
          style={{
            top: arrowTop,
            right: arrowRight,
          }}
          className="arrow up-arrow"
        >
          ▲
        </span>
        <span
          style={{
            bottom: arrowBottom,
            right: arrowRight,
          }}
          className="arrow down-arrow"
        >
          ▼
        </span>
        <div className={contentClassName}>
          <MarkdownView
            content={body}
            isVideoFullScreenEnabled={false}
            isAnimationClickable={isAnimationClickable}
            onEnded={onEnded}
          />
        </div>
      </>
    </CustomScroll>
  ) : (
    <div className={contentClassName}>
      <MarkdownView
        content={body}
        isVideoFullScreenEnabled={false}
        isAnimationClickable={isAnimationClickable}
        onEnded={onEnded}
      />
    </div>
  );

  const wrapperClassName = clsx('slide-shell', className);

  return (
    <div className={wrapperClassName} style={style}>
      <div style={slideStyle} className="slide-root">
        {backgroundImageUrl ? (
          <img
            src={backgroundImageUrl}
            alt=""
            aria-hidden="true"
            className="slide-background-image"
          />
        ) : null}
        <div className="slide-foreground" style={foregroundStyle}>
          {content}
        </div>

        {slideNumber !== undefined && slideCount !== undefined ? (
          <div className="slide-numbers">
            {slideNumber}/{slideCount}
          </div>
        ) : null}
      </div>
    </div>
  );
}
