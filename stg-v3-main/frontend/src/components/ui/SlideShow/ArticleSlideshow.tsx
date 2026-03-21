import {useMemo, useState} from 'react';
import fm from 'front-matter';
import 'yet-another-react-lightbox/styles.css';
import {
  type LanguageCode,
  type AgeGroup,
  type ArticleChapter,
  type StrengthSlug,
} from '@client/ApiTypes.js';
import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import {MarkdownView} from '../MarkdownView.js';
import './SlideLightbox.scss';
import SlideLightbox from './SlideLightbox.js';
import AutoScaleSlide from './AutoScaleSlide.js';
import {type SlideAttributes} from './SlideTypes.js';
import './ArticleSlideshow.scss';
import {useIsSubscriptionLimited} from '@/hooks/useIsSubscriptionLimited.js';

type Properties = {
  readonly articleId: string;
  readonly content: string[];
  readonly language: LanguageCode;
  readonly isFree: boolean;
  readonly isTimelineArticle: boolean;
  readonly timelineStrength: StrengthSlug;
  readonly timelineAgeGroup: AgeGroup;
  readonly timelineChapter: ArticleChapter;
};

export default function ArticleSlideshow({
  content,
  articleId,
  language,
  isFree,
  isTimelineArticle,
  timelineStrength,
  timelineAgeGroup,
  timelineChapter,
}: Properties) {
  const [isOpen, setIsOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const isSubscriptionLimited = useIsSubscriptionLimited();
  const isLocked = !isFree && isSubscriptionLimited;

  const slidesWithoutNotes = useMemo(() => {
    return content.filter((section) => {
      const {attributes} = fm(section);
      const {layout} = attributes as SlideAttributes;
      return layout !== 'notes';
    });
  }, [content]);
  let slideNumber = 1;

  return (
    <div className="d-flex flex-column gap-3 mb-3">
      <div>
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Trans>Open slideshow</Trans>
        </Button>
      </div>

      {content.map((section, index) => {
        const {body, attributes} = fm(section);
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
        } = attributes as SlideAttributes;

        if (layout === 'notes') {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <MarkdownView content={body} />
            </div>
          );
        }

        let indexWithoutNotes = 0;
        for (let i = 0; i < index; i++) {
          const {attributes} = fm(content[i]);
          const {layout} = attributes as SlideAttributes;
          if (layout !== 'notes') indexWithoutNotes++;
        }

        const openLightbox = () => {
          setIsOpen(true);
          setSlideIndex(indexWithoutNotes + (isTimelineArticle ? 1 : 0));
        };

        return (
          <div key={body} className="article-slide-wrapper border">
            <div className="article-slide-content">
              <AutoScaleSlide
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
                slideNumber={slideNumber++}
                slideCount={slidesWithoutNotes.length}
                isLocked={isLocked}
                isAnimationClickable={false}
              />
            </div>
            <button
              type="button"
              className="article-slide-overlay"
              aria-label="Open slideshow"
              onClick={openLightbox}
            />
          </div>
        );
      })}

      {isTimelineArticle ? (
        <SlideLightbox
          articleId={articleId}
          content={slidesWithoutNotes}
          isFree={isFree}
          slideIndex={slideIndex}
          setSlideIndex={setSlideIndex}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isTimelineArticle={isTimelineArticle}
          timelineStrength={timelineStrength}
          timelineAgeGroup={timelineAgeGroup}
          timelineChapter={timelineChapter}
          language={language}
        />
      ) : (
        <SlideLightbox
          articleId={articleId}
          content={slidesWithoutNotes}
          isFree={isFree}
          slideIndex={slideIndex}
          setSlideIndex={setSlideIndex}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isTimelineArticle={false}
        />
      )}
    </div>
  );
}
