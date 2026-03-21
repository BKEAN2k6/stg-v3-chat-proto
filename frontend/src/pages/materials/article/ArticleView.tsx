import 'yet-another-react-lightbox/styles.css';
import {Clock} from 'react-bootstrap-icons';
import fm from 'front-matter';
import {
  type StrengthSlug,
  type ArticleTranslation,
  type AgeGroup,
  type ArticleChapter,
  type LanguageCode,
} from '@client/ApiTypes';
import ArticleSlideshow from '@/components/ui/SlideShow/ArticleSlideshow.js';
import StrengthList from '@/components/ui/StrengthList.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';

type Properties = {
  readonly articleId: string;
  readonly article: ArticleTranslation;
  readonly language: LanguageCode;
  readonly length: string;
  readonly strengths: StrengthSlug[];
  readonly isTimelineArticle: boolean;
  readonly timelineStrength: StrengthSlug;
  readonly timelineAgeGroup: AgeGroup;
  readonly timelineChapter: ArticleChapter;
};

export default function ArticleView({
  article,
  language,
  length,
  strengths,
  articleId,
  isTimelineArticle,
  timelineStrength,
  timelineAgeGroup,
  timelineChapter,
}: Properties) {
  const {content} = article;

  for (const section of content) {
    try {
      fm(section);
    } catch {
      return (
        <p>
          Invalid article content. Check the syntax between the &quot;---&quot;
        </p>
      );
    }
  }

  return (
    <div>
      <div className="d-flex gap-3 mb-3">
        <StrengthList strengths={strengths} />
        <div className="d-flex align-items-center">
          <Clock
            size={14}
            style={{
              marginTop: '-2px',
            }}
          />
          <span style={{marginLeft: '4px'}}>{length}</span>
        </div>
      </div>
      {content.length > 1 ? (
        <ArticleSlideshow
          content={content}
          language={language}
          articleId={articleId}
          isTimelineArticle={isTimelineArticle}
          timelineStrength={timelineStrength}
          timelineAgeGroup={timelineAgeGroup}
          timelineChapter={timelineChapter}
        />
      ) : (
        <MarkdownView content={content[0]} />
      )}
    </div>
  );
}
