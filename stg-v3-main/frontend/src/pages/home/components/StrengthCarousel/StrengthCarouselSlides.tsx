import {keepPreviousData} from '@tanstack/react-query';
import {useGetArticleQuery} from '@client/ApiHooks.js';
import InlineSlideshow from '@/components/ui/SlideShow/InlineSlideshow.js';
import CenteredLoader from '@/components/CenteredLoader.js';
import {CrossFade} from '@/components/ui/CrossFade/CrossFade.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';

type Properties = {
  readonly articleId: string;
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
};

export default function StrengthCarouselSlides({
  articleId,
  isOpen,
  setIsOpen,
}: Properties) {
  const {activeGroup} = useActiveGroup();
  const {data: article, error} = useGetArticleQuery(
    {id: articleId},
    {enabled: Boolean(articleId), placeholderData: keepPreviousData},
  );

  if (!activeGroup) {
    return null;
  }

  if (!articleId) {
    return (
      <div className="ratio ratio-16x9">
        <div className="d-flex align-items-center justify-content-center h-100">
          Article not found
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ratio ratio-16x9">
        <div className="d-flex align-items-center justify-content-center h-100">
          Error loading article
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="ratio ratio-16x9">
        <CenteredLoader />
      </div>
    );
  }

  const translation = article.translations.find(
    (translation) => translation.language === activeGroup.language,
  );
  if (!translation) {
    return null;
  }

  return (
    <CrossFade key={activeGroup.language} contentKey={article.id}>
      <div style={{position: 'relative'}}>
        <button
          type="button"
          className="yarl__button position-absolute"
          style={{
            top: 4,
            right: 4,
            zIndex: 10,
          }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
            className="yarl__icon"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="12" x2="6" y2="6" />
              <line x1="12" y1="12" x2="18" y2="6" />
              <line x1="12" y1="12" x2="18" y2="18" />
              <line x1="12" y1="12" x2="6" y2="18" />

              <line x1="6" y1="6" x2="9" y2="6" />
              <line x1="6" y1="6" x2="6" y2="9" />
              <line x1="18" y1="6" x2="15" y2="6" />
              <line x1="18" y1="6" x2="18" y2="9" />
              <line x1="18" y1="18" x2="15" y2="18" />
              <line x1="18" y1="18" x2="18" y2="15" />
              <line x1="6" y1="18" x2="9" y2="18" />
              <line x1="6" y1="18" x2="6" y2="15" />
            </g>
          </svg>
        </button>

        <InlineSlideshow
          isTimelineArticle
          articleId={article.id}
          isFree={article.isFree}
          language={activeGroup.language}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          content={translation.content}
          timelineChapter={article.timelineChapter}
          timelineStrength={article.timelineStrength}
          timelineAgeGroup={article.timelineAgeGroup}
        />
      </div>
    </CrossFade>
  );
}
