import {Tab, Tabs} from 'react-bootstrap';
import {type Article} from '@client/ApiTypes';
import ArticleView from './ArticleView.js';

type Properties = {
  readonly article: Article;
};

export default function ArticlePreview(properties: Properties) {
  const {article} = properties;
  const {
    id,
    translations,
    length,
    strengths,
    isTimelineArticle,
    timelineStrength,
    timelineAgeGroup,
    timelineChapter,
  } = article;

  if (translations.length === 0) {
    return null;
  }

  const defaultActiveKey = translations[0].language;

  return (
    <Tabs
      unmountOnExit
      mountOnEnter
      defaultActiveKey={defaultActiveKey}
      id="translations"
      className="mb-3"
    >
      {translations.map((translation) => (
        <Tab
          key={translation.language}
          eventKey={translation.language}
          title={translation.language}
        >
          <ArticleView
            articleId={id}
            article={translation}
            language={translation.language}
            length={length}
            strengths={strengths}
            isTimelineArticle={isTimelineArticle}
            timelineStrength={timelineStrength}
            timelineAgeGroup={timelineAgeGroup}
            timelineChapter={timelineChapter}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
