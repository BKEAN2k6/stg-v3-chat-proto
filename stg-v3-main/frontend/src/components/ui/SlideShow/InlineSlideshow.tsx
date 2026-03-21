import {useMemo, useState} from 'react';
import fm from 'front-matter';
import {
  type LanguageCode,
  type AgeGroup,
  type ArticleChapter,
  type StrengthSlug,
} from '@client/ApiTypes.js';
import SlideLightbox from './SlideLightbox.js';
import {type SlideAttributes} from './SlideTypes.js';

type Properties = {
  readonly articleId: string;
  readonly isFree: boolean;
  readonly content: string[];
  readonly language: LanguageCode;
  readonly isTimelineArticle: boolean;
  readonly timelineChapter: ArticleChapter;
  readonly timelineStrength: StrengthSlug;
  readonly timelineAgeGroup: AgeGroup;
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
};

export default function InlineSlideshow({
  articleId,
  isFree,
  content,
  language,
  isTimelineArticle,
  timelineChapter,
  timelineStrength,
  timelineAgeGroup,
  isOpen,
  setIsOpen,
}: Properties) {
  const [slideIndex, setSlideIndex] = useState(0);

  const slidesWithoutNotes = useMemo(() => {
    return content.filter((section) => {
      const {attributes} = fm(section);
      const {layout} = attributes as SlideAttributes;
      return layout !== 'notes';
    });
  }, [content]);

  return (
    <>
      <div className="w-100 inline-slides">
        {isTimelineArticle ? (
          <SlideLightbox
            isInline
            articleId={articleId}
            isFree={isFree}
            content={slidesWithoutNotes}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
            language={language}
            isTimelineArticle={isTimelineArticle}
            timelineStrength={timelineStrength}
            timelineAgeGroup={timelineAgeGroup}
            timelineChapter={timelineChapter}
            onClick={() => {
              setIsOpen(true);
            }}
          />
        ) : (
          <SlideLightbox
            isInline
            articleId={articleId}
            isFree={isFree}
            content={slidesWithoutNotes}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
            isTimelineArticle={false}
            onClick={() => {
              setIsOpen(true);
            }}
          />
        )}
      </div>
      {isTimelineArticle ? (
        <SlideLightbox
          articleId={articleId}
          isFree={isFree}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          content={slidesWithoutNotes}
          language={language}
          slideIndex={slideIndex}
          setSlideIndex={setSlideIndex}
          isTimelineArticle={isTimelineArticle}
          timelineStrength={timelineStrength}
          timelineAgeGroup={timelineAgeGroup}
          timelineChapter={timelineChapter}
        />
      ) : (
        <SlideLightbox
          articleId={articleId}
          isFree={isFree}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isTimelineArticle={false}
          content={slidesWithoutNotes}
          slideIndex={slideIndex}
          setSlideIndex={setSlideIndex}
        />
      )}
    </>
  );
}
