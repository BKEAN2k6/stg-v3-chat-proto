import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {type Article, type LanguageCode} from '@client/ApiTypes';
import ArticleDetailsForm from './ArticleDetailsForm.js';
import ArticleTimelineForm from './ArticleTimelineForm.js';
import ArticleTranslations from './ArticleTranslations.js';
import ArticlePreview from './ArticlePreview.js';
import ArticleCardPreview from './ArticleCardPreview.js';
import ArticleHistory from './ArticleHistory.js';

type Properties = {
  readonly article: Article;
  readonly onChange: (article: Article) => void;
  readonly onTranslate?: (source: LanguageCode, target: LanguageCode) => void;
  readonly isTranslating?: boolean;
};

export default function ArticleEdit(properties: Properties) {
  const {article, onChange, onTranslate, isTranslating} = properties;

  return (
    <Tabs
      unmountOnExit
      mountOnEnter
      defaultActiveKey="details"
      className="mb-3"
    >
      <Tab eventKey="details" title="Details">
        <ArticleDetailsForm article={article} onChange={onChange} />
      </Tab>
      <Tab eventKey="content" title="Content">
        <ArticleTranslations
          translations={article.translations}
          isTranslating={isTranslating}
          onChange={(translations) => {
            onChange({...article, translations});
          }}
          onTranslate={onTranslate}
        />
      </Tab>
      <Tab eventKey="content-preview" title="Content Preview">
        <ArticlePreview article={article} />
      </Tab>
      <Tab eventKey="card-preview" title="Card preview">
        <ArticleCardPreview article={article} />
      </Tab>
      <Tab eventKey="timeline" title="Timeline">
        <ArticleTimelineForm article={article} onChange={onChange} />
      </Tab>
      <Tab eventKey="history" title="History">
        <ArticleHistory id={article.id} />
      </Tab>
    </Tabs>
  );
}
