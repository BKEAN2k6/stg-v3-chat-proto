import {createPortal} from 'react-dom';
import {type CSSProperties, useMemo} from 'react';
import {useWindowSize} from 'react-use';
import {Button} from 'react-bootstrap';
import {
  type ArticleChapter,
  type LanguageCode,
  type StrengthSlug,
} from '@client/ApiTypes.js';
import ProgressCard from './ProgressCard.js';
import {
  markAsReadCancelTranslations,
  markAsReadQuestionTranslations,
  markAsReadTranslations,
} from './translations.js';

const defaultCardWidthPx = 420;
const minimumCardWidthPx = 300;

type Properties = {
  readonly isVisible: boolean;
  readonly isBackdropVisible: boolean;
  readonly isCardVisible: boolean;
  readonly isSlidingDown: boolean;
  readonly isAnimationRunning: boolean;
  readonly strength: StrengthSlug;
  readonly completedChapters: ArticleChapter[];
  readonly language: LanguageCode;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly portalTarget?: Element | undefined;
  readonly scale?: number;
  /** When true, renders inline without portal and uses absolute positioning */
  readonly isEmbedded?: boolean;
  /** When true, shows the question and action buttons. Default true. */
  readonly isShowingActions?: boolean;
  readonly isLocked: boolean;
};

type OverlayVisibilityState = 'hidden' | 'visible';
type SlideTransitionState = 'idle' | 'entering' | 'exiting';
type CardVisibilityState = 'hidden' | 'visible';
type OverlayScaleStyle = CSSProperties & {
  '--slide-read-overlay-scale'?: number;
};

// eslint-disable-next-line complexity
export default function MarkAsReadOverlay({
  isVisible,
  isBackdropVisible,
  isCardVisible,
  isSlidingDown,
  isAnimationRunning,
  strength,
  completedChapters,
  language,
  onConfirm,
  onCancel,
  portalTarget,
  scale = 1,
  isEmbedded = false,
  isShowingActions = true,
  isLocked,
}: Properties) {
  const {width: viewportWidth} = useWindowSize();
  const shouldRender =
    isVisible || isBackdropVisible || isCardVisible || isAnimationRunning;

  const contentWidth = useMemo(() => {
    if (isEmbedded) return defaultCardWidthPx;
    const effectiveViewportWidth =
      typeof viewportWidth === 'number' && viewportWidth > 0
        ? viewportWidth
        : defaultCardWidthPx;
    const preferredWidth = effectiveViewportWidth * 0.9;
    return Math.min(
      defaultCardWidthPx,
      Math.max(minimumCardWidthPx, preferredWidth),
    );
  }, [isEmbedded, viewportWidth]);

  if (!shouldRender) return null;

  const cardIsVisible = isVisible || isCardVisible || isAnimationRunning;
  const overlayState: OverlayVisibilityState =
    isVisible || isBackdropVisible || isAnimationRunning ? 'visible' : 'hidden';
  const shouldSlideDown = isSlidingDown;
  // Animate in when first showing (either from prompt or from animation start)
  const shouldAnimateIn = (isVisible || isCardVisible) && !isSlidingDown;
  const slideState: SlideTransitionState = shouldSlideDown
    ? 'exiting'
    : shouldAnimateIn
      ? 'entering'
      : 'idle';
  const cardState: CardVisibilityState = cardIsVisible ? 'visible' : 'hidden';
  const baseContentWidth = contentWidth > 0 ? contentWidth : defaultCardWidthPx;
  const normalizedScale = Math.max(scale, 0);
  const minScaleFromWidth = Math.min(1, minimumCardWidthPx / baseContentWidth);
  const effectiveScale = Math.max(normalizedScale, minScaleFromWidth);
  const scaleStyle: OverlayScaleStyle | undefined = isEmbedded
    ? undefined
    : {'--slide-read-overlay-scale': effectiveScale};

  const overlayContent = (
    <div
      className={`slide-read-overlay${isEmbedded ? ' slide-read-overlay--embedded' : ''}`}
      data-overlay-state={overlayState}
    >
      <div className="slide-read-overlay__scale" style={scaleStyle}>
        <div
          className="slide-read-overlay__content"
          data-slide-state={slideState}
        >
          <div className="slide-read-overlay__card" data-card-state={cardState}>
            <ProgressCard
              strength={strength}
              completedChapters={completedChapters}
              language={language}
            />
          </div>

          {isShowingActions && (isVisible || isAnimationRunning) ? (
            <div className="slide-read-overlay__actions">
              <p className="slide-read-overlay__question">
                {markAsReadQuestionTranslations[language]}
              </p>
              <div className="slide-read-overlay__buttons">
                <Button
                  disabled={isAnimationRunning || isLocked}
                  variant="primary"
                  className="slide-read-overlay__button"
                  onClick={onConfirm}
                >
                  {markAsReadTranslations[language]}
                </Button>
                <Button
                  disabled={isAnimationRunning}
                  variant="light"
                  className="slide-read-overlay__button"
                  onClick={onCancel}
                >
                  {markAsReadCancelTranslations[language]}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return overlayContent;
  }

  return createPortal(overlayContent, portalTarget ?? document.body);
}
