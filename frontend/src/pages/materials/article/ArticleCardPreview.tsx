import {Tab, Tabs} from 'react-bootstrap';
import type {Article} from '@client/ApiTypes';
import ArticleCard from '../components/ArticleCard.js';

type Properties = {
  readonly article: Article;
};

export default function ArticleCardPreview(properties: Properties) {
  const {article} = properties;
  const {id, thumbnail, translations, length, strengths} = article;

  if (translations.length === 0) {
    return null;
  }

  const defaultActiveKey = translations[0].language;

  return (
    <Tabs
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
          <ArticleCard
            id={id}
            thumbnail={thumbnail ?? ''}
            title={translation.title}
            description={translation.description}
            length={length}
            strengths={strengths}
            languageCode={translation.language}
            rootCategoryId={article.categoryPath[0].id}
            isLocked={article.isLocked}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
