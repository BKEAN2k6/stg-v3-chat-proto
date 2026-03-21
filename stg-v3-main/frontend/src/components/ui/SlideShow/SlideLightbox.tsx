import clsx from 'clsx';
import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {i18n} from '@lingui/core';
import Lightbox, {
  type Slide,
  type CustomSlide,
  type EndScreenSlideType,
  type StartSlideType,
  CloseIcon,
  IconButton,
} from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import fm from 'front-matter';
import {
  type LanguageCode,
  type AgeGroup,
  type ArticleChapter,
  type StrengthSlug,
} from '@client/ApiTypes.js';
import {useGetTimelineArticlesQuery} from '@client/ApiHooks.js';
import './SlideLightbox.scss';
import AutoScaleSlide from './AutoScaleSlide.js';
import EndScreenSlide from './EndScreenSlide.js';
import StartSlide from './StartSlide.js';
import {useTimelineCompletion} from './useTimelineCompletion.js';
import {chapterOrder, getCompletedChapters} from './timelineProgress.js';
import MarkAsReadOverlay from './MarkAsReadOverlay.js';
import {useSlidePrinter} from './useSlidePrinter.js';
import {type SlideAttributes} from './SlideTypes.js';
import ArticleProgressGoal from '@/components/ui/StrengthGoal/ArticleProgressGoal.js';
import {usePlayerContext} from '@/context/Video/PlayerProvider.js';
import {type GroupedGoal} from '@/components/ui/StrengthGoal/useGroupedGoals.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {strengthTranslationMap, slugToListItem} from '@/helpers/strengths.js';
import {
  chaptersTranslationMap,
  ageGroupsTranslationMap,
} from '@/helpers/article.js';
import {track} from '@/helpers/analytics.js';
import {useIsSubscriptionLimited} from '@/hooks/useIsSubscriptionLimited.js';

const userAgent =
  typeof navigator === 'undefined' ? '' : navigator.userAgent.toLowerCase();
const isMobile =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent,
  );

function hasVimeoContent(content: string): boolean {
  return content.includes('https://vimeo.com/');
}

function hasAnimationContent(section: string): boolean {
  const {body} = parseSlideContent(section);
  return body.includes('animation://');
}

function PrintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1.5 -1.5 27 27"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function parseSlideContent(section: string): {
  body: string;
  attributes: SlideAttributes;
} {
  const {body, attributes} = fm(section);
  return {
    body,
    attributes: attributes as SlideAttributes,
  };
}

declare module 'yet-another-react-lightbox' {
  export type CustomSlide = {
    type: 'custom-slide';
    content: string;
    slideNumber: number;
    slideCount: number;
  } & GenericSlide;

  export type EndScreenSlideType = {
    type: 'end-screen-slide';
  };

  export type StartSlideType = {
    type: 'start-slide';
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SlideTypes {
    'custom-slide': CustomSlide;
    'start-slide': StartSlideType;
    'end-screen-slide': EndScreenSlideType;
  }
}

function isCustomSlide(slide: Slide): slide is CustomSlide {
  return slide.type === 'custom-slide';
}

type BaseProperties = {
  readonly content: string[];
  readonly articleId: string;
  readonly isFree: boolean;
  readonly isOpen?: boolean;
  readonly setIsOpen?: (isOpen: boolean) => void;
  readonly slideIndex: number;
  readonly setSlideIndex: React.Dispatch<SetStateAction<number>>;
  readonly isInline?: boolean;
  readonly onClick?: (index: number) => void;
};

type TimelineArticleProperties = {
  readonly isTimelineArticle: true;
  readonly timelineChapter: ArticleChapter;
  readonly timelineAgeGroup: AgeGroup;
  readonly timelineStrength: StrengthSlug;
  readonly language: LanguageCode;
} & BaseProperties;

type NonTimelineArticleProperties = {
  readonly isTimelineArticle: false;
  readonly timelineChapter?: never;
  readonly timelineAgeGroup?: never;
  readonly timelineStrength?: never;
  readonly language?: never;
} & BaseProperties;

type Properties = TimelineArticleProperties | NonTimelineArticleProperties;

// eslint-disable-next-line complexity
export default function SlideLightbox(properties: Properties) {
  const {
    content,
    articleId,
    isFree,
    isOpen,
    setIsOpen,
    slideIndex,
    setSlideIndex,
    isInline,
    onClick,
    isTimelineArticle,
    timelineChapter,
    timelineAgeGroup,
    timelineStrength,
    language,
  } = properties;
  const {stopAllPlayers} = usePlayerContext();
  const isSubscriptionLimited = useIsSubscriptionLimited();
  const isLocked = !isFree && isSubscriptionLimited;
  const {activeGroup} = useActiveGroup();
  const [isExitPromptVisible, setIsExitPromptVisible] = useState(false);
  const hasEndSlide =
    isTimelineArticle &&
    !activeGroup?.articleProgress?.some(
      (progress) => progress.article === articleId,
    );
  const {printSlide, SlidePrintPortal} = useSlidePrinter();

  const closeLightbox = useCallback(() => {
    setIsExitPromptVisible(false);
    setIsOpen?.(false);
    stopAllPlayers();
  }, [setIsOpen, stopAllPlayers]);
  const slideFrameClassName = clsx(
    'slide-lightbox__frame',
    isInline && 'slide-lightbox__frame--inline',
  );

  const {
    isCompleted: isCompletionCompleted,
    isAnimationRunning: isCompletionRunning,
    showBackdrop: completionBackdropVisible,
    showCard: completionCardVisible,
    isSlidingDown: completionSlidingDown,
    markAsRead: markArticleAsRead,
    dismissWithAnimation,
    reset: resetCompletionAnimation,
  } = useTimelineCompletion({
    groupId: activeGroup?.id ?? '',
    articleId,
    onDone: closeLightbox,
  });
  const isPromptActive = isExitPromptVisible || isCompletionRunning;
  const isLightboxOpen = isOpen ? true : isPromptActive;
  const shouldAskToMarkAsRead =
    isTimelineArticle && hasEndSlide && !isInline && slideIndex > 0;
  const shouldBlockClose = isPromptActive || shouldAskToMarkAsRead;
  const resolvePortalTarget = useCallback((): Element | undefined => {
    const ownerDocument = document as Document & {
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };

    const fullscreenElement =
      ownerDocument.fullscreenElement ??
      ownerDocument.webkitFullscreenElement ??
      ownerDocument.mozFullScreenElement ??
      ownerDocument.msFullscreenElement;

    if (fullscreenElement) {
      const searchRoot: Element | ShadowRoot =
        fullscreenElement.shadowRoot ?? fullscreenElement;
      const fullscreenPortal = searchRoot.querySelector('.yarl__portal');
      if (fullscreenPortal) return fullscreenPortal;
      return fullscreenElement;
    }

    const portals = [...ownerDocument.querySelectorAll('.yarl__portal')];
    const latestPortal = portals.at(-1);
    if (latestPortal) return latestPortal;

    const roots = [...ownerDocument.querySelectorAll('.yarl__root')];
    return roots.at(-1) ?? undefined;
  }, []);

  const [portalTarget, setPortalTarget] = useState<Element | undefined>(
    resolvePortalTarget() ?? document.body,
  );

  const {data: timelineArticles} = useGetTimelineArticlesQuery({
    enabled: isTimelineArticle,
  });

  useEffect(() => {
    return () => {
      stopAllPlayers();
    };
  }, [slideIndex, stopAllPlayers]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const updatePortal = () => {
      const nextTarget = resolvePortalTarget() ?? document.body;
      setPortalTarget(nextTarget);
    };

    updatePortal();

    const events: string[] = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    for (const event of events) {
      document.addEventListener(event, updatePortal);
    }

    return () => {
      for (const event of events) {
        document.removeEventListener(event, updatePortal);
      }
    };
  }, [isLightboxOpen, resolvePortalTarget]);

  useEffect(() => {
    if (!isPromptActive) return;
    const nextTarget = resolvePortalTarget() ?? document.body;
    setPortalTarget(nextTarget);
  }, [isPromptActive, resolvePortalTarget]);

  const handleClose = useCallback(() => {
    if (isExitPromptVisible || isCompletionRunning) return;

    if (shouldAskToMarkAsRead) {
      setIsExitPromptVisible(true);
      setIsOpen?.(true);
      return;
    }

    closeLightbox();
  }, [
    closeLightbox,
    isExitPromptVisible,
    isCompletionRunning,
    shouldAskToMarkAsRead,
    setIsOpen,
  ]);

  const handleView = useCallback(
    (index: number) => {
      setSlideIndex(index);
    },
    [setSlideIndex],
  );

  const handleConfirmMarkAsRead = useCallback(() => {
    void markArticleAsRead({skipInitialDelay: true});
  }, [markArticleAsRead]);

  const handleCancelMarkAsRead = useCallback(() => {
    setIsExitPromptVisible(false);
    void dismissWithAnimation();
  }, [dismissWithAnimation]);

  useEffect(() => {
    if (isOpen) {
      track('Slides presentation');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!shouldAskToMarkAsRead || !isLightboxOpen || isInline) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (isExitPromptVisible || isCompletionRunning) return;

      setIsExitPromptVisible(true);
      setIsOpen?.(true);
    };

    globalThis.addEventListener('keydown', handleKeyDown, {capture: true});
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown, {capture: true});
    };
  }, [
    isCompletionRunning,
    isExitPromptVisible,
    isLightboxOpen,
    isInline,
    setIsOpen,
    shouldAskToMarkAsRead,
  ]);

  useEffect(() => {
    setSlideIndex(0);
  }, [setSlideIndex, content]);

  useEffect(() => {
    if (!isOpen) {
      // Keep prompt/animation alive even if parent toggles isOpen false
      // while we are showing the exit prompt.
      if (isPromptActive) return;
      setIsExitPromptVisible(false);
      resetCompletionAnimation();
    }
  }, [isOpen, isPromptActive, resetCompletionAnimation]);

  const [goal, setGoal] = useState<GroupedGoal | undefined>(
    isTimelineArticle && hasEndSlide
      ? {
          ...slugToListItem(timelineStrength, i18n.locale),
          id: '',
          group: activeGroup ?? {name: '', id: ''},
          strength: timelineStrength,
          events: [],
          target: content.length + 1,
          targetDate: new Date().toJSON(),
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
          completedCount: 0,
          isSystemCreated: true,
        }
      : undefined,
  );

  useEffect(() => {
    if (isTimelineArticle && hasEndSlide) {
      setGoal({
        ...slugToListItem(timelineStrength, i18n.locale),
        id: '',
        group: activeGroup ?? {name: '', id: ''},
        strength: timelineStrength,
        events: [],
        target: content.length + 1,
        targetDate: new Date().toJSON(),
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        completedCount: 0,
        isSystemCreated: true,
      });
    } else {
      setGoal(undefined);
    }
  }, [isTimelineArticle, timelineStrength, activeGroup, content, hasEndSlide]);

  const rawCompletedChapters = useMemo(
    () =>
      isTimelineArticle
        ? getCompletedChapters(
            timelineArticles ?? [],
            activeGroup?.articleProgress ?? [],
            articleId,
          )
        : [],
    [
      isTimelineArticle,
      timelineArticles,
      activeGroup?.articleProgress,
      articleId,
    ],
  );

  const effectiveCompletedChapters = useMemo(() => {
    if (!isTimelineArticle) return [];
    const completed = new Set<ArticleChapter>(rawCompletedChapters);
    if (isCompletionCompleted) {
      completed.add(timelineChapter);
    }

    return chapterOrder.filter((chapter) => completed.has(chapter));
  }, [
    isTimelineArticle,
    rawCompletedChapters,
    isCompletionCompleted,
    timelineChapter,
  ]);

  const onSlideEnd = useCallback(() => {
    setSlideIndex((previousIndex) => previousIndex + 1);
    const container = document.querySelector('.yarl__container');
    if (container instanceof HTMLElement) {
      container.focus();
    }
  }, [setSlideIndex]);

  const slides: Array<CustomSlide | StartSlideType | EndScreenSlideType> =
    content.map(
      (section, index): CustomSlide => ({
        type: 'custom-slide',
        content: section,
        slideNumber: index + 1,
        slideCount: content.length,
      }),
    );

  if (isTimelineArticle) {
    slides.unshift({
      type: 'start-slide',
    });

    if (hasEndSlide) {
      slides.push({
        type: 'end-screen-slide',
      });
    }
  }

  const activeSlide = slides[slideIndex];

  return (
    <>
      <Lightbox
        carousel={{finite: true, padding: 0, spacing: 0}}
        slides={slides}
        render={{
          slide({slide}) {
            if (isCustomSlide(slide)) {
              const {content, slideNumber, slideCount} = slide;
              const {body, attributes} = parseSlideContent(content);
              const {
                layout,
                color,
                shadowColor,
                background = 'default',
                backgroundColor,
                paddingTop,
                paddingBottom,
                paddingLeft,
                paddingRight,
                scrollable = false,
              } = attributes;

              return (
                <div
                  className={slideFrameClassName}
                  style={{cursor: onClick ? 'pointer' : 'auto'}}
                >
                  <AutoScaleSlide
                    isAnimationClickable={isOpen}
                    body={body}
                    layout={layout}
                    color={color}
                    shadowColor={shadowColor}
                    background={background}
                    backgroundColor={backgroundColor}
                    paddingTop={paddingTop}
                    paddingBottom={paddingBottom}
                    paddingLeft={paddingLeft}
                    paddingRight={paddingRight}
                    isScrollable={scrollable}
                    slideNumber={slideNumber}
                    slideCount={slideCount + (hasEndSlide ? 1 : 0)}
                    isLocked={isLocked}
                    onEnded={onSlideEnd}
                  />

                  {isInline && onClick ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        zIndex: 1,
                        pointerEvents: 'auto',
                      }}
                      onClick={() => {
                        onClick(slideIndex);
                      }}
                    />
                  ) : null}
                </div>
              );
            }

            if (slide.type === 'start-slide' && isTimelineArticle) {
              return (
                <div
                  className={slideFrameClassName}
                  style={{cursor: onClick ? 'pointer' : 'auto'}}
                >
                  <StartSlide
                    isFullScreen={Boolean(isOpen)}
                    strength={timelineStrength}
                    chapter={timelineChapter}
                    ageGroup={timelineAgeGroup}
                    language={language}
                    slideCount={slides.length - 1}
                  />
                  {isInline && onClick ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        zIndex: 1,
                        pointerEvents: 'auto',
                      }}
                      onClick={() => {
                        onClick(slideIndex);
                      }}
                    />
                  ) : null}
                </div>
              );
            }

            if (slide.type === 'end-screen-slide' && isTimelineArticle) {
              return (
                <div
                  className={slideFrameClassName}
                  style={{cursor: onClick ? 'pointer' : 'auto'}}
                >
                  <EndScreenSlide
                    strength={timelineStrength}
                    chapter={timelineChapter}
                    language={language}
                    isMarkingAsRead={isCompletionRunning}
                    isLocked={isLocked}
                    onMarkAsRead={markArticleAsRead}
                  />
                  {isInline && onClick ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        zIndex: 1,
                        pointerEvents: 'auto',
                      }}
                      onClick={() => {
                        onClick(slideIndex);
                      }}
                    />
                  ) : null}
                </div>
              );
            }

            return null;
          },
          controls() {
            if (!(goal && activeGroup) || isInline) return null;
            return <ArticleProgressGoal goal={goal} />;
          },
          buttonClose: shouldBlockClose
            ? () => (
                <IconButton
                  key="prompt-close"
                  label="Close"
                  icon={CloseIcon}
                  onClick={handleClose}
                />
              )
            : undefined,
          buttonPrev: slideIndex === 0 ? () => null : undefined,
          buttonNext:
            slideIndex === content.length + Number(hasEndSlide ? 1 : 0)
              ? () => null
              : undefined,
        }}
        plugins={isInline ? [Inline] : [Fullscreen]}
        toolbar={{
          buttons: [
            !isInline &&
              !isMobile &&
              activeSlide &&
              isCustomSlide(activeSlide) &&
              !hasVimeoContent(activeSlide.content) &&
              !hasAnimationContent(activeSlide.content) && (
                <IconButton
                  key="print"
                  label={'Print' as 'Close'}
                  icon={PrintIcon}
                  onClick={() => {
                    const {body, attributes} = parseSlideContent(
                      activeSlide.content,
                    );

                    let printTitle: string | undefined;

                    if (isTimelineArticle && language) {
                      const strengthTitle =
                        strengthTranslationMap[timelineStrength][language];
                      const chapterTitle =
                        chaptersTranslationMap[timelineChapter][language];
                      const ageGroupTitle =
                        ageGroupsTranslationMap[timelineAgeGroup][language];

                      printTitle = `${strengthTitle} ${chapterTitle} ${ageGroupTitle} ${activeSlide.slideNumber}`;
                    }

                    printSlide({
                      body,
                      attributes: {
                        ...attributes,
                        scrollable: Boolean(attributes?.scrollable),
                      },
                      slideNumber: activeSlide.slideNumber,
                      slideCount:
                        activeSlide.slideCount + (hasEndSlide ? 1 : 0),
                      title: printTitle,
                    });
                  }}
                />
              ),
            !isInline && 'fullscreen',
            !isInline && 'close',
          ].filter(Boolean),
        }}
        inline={
          isInline ? {style: {width: '100%', aspectRatio: '16 / 9'}} : undefined
        }
        open={isInline ? undefined : isLightboxOpen}
        controller={
          isInline
            ? undefined
            : {
                closeOnBackdropClick: !shouldBlockClose,
                closeOnPullDown: !shouldBlockClose,
                closeOnPullUp: !shouldBlockClose,
              }
        }
        index={slideIndex}
        close={handleClose}
        on={{
          view({index}) {
            if (goal && goal.events.length < index) {
              const eventCount = index - goal.events.length;

              const events = Array.from({length: eventCount}, () => ({
                createdAt: new Date().toJSON(),
              }));

              setGoal((previousGoal) => {
                if (!previousGoal) return previousGoal;
                return {
                  ...previousGoal,
                  events: [...previousGoal.events, ...events],
                };
              });
            }

            handleView(index);
          },
        }}
      />

      {isTimelineArticle &&
      hasEndSlide &&
      (isExitPromptVisible || isCompletionRunning) ? (
        <MarkAsReadOverlay
          isVisible={isExitPromptVisible}
          isBackdropVisible={completionBackdropVisible}
          isCardVisible={completionCardVisible}
          isSlidingDown={completionSlidingDown}
          isAnimationRunning={isCompletionRunning}
          strength={timelineStrength}
          completedChapters={effectiveCompletedChapters}
          language={language}
          portalTarget={portalTarget ?? document.body}
          isShowingActions={isExitPromptVisible}
          isLocked={isLocked}
          onConfirm={handleConfirmMarkAsRead}
          onCancel={handleCancelMarkAsRead}
        />
      ) : null}
      <SlidePrintPortal />
    </>
  );
}
