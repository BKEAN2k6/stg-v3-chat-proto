import {Tab, Tabs} from 'react-bootstrap';
import ArticleCard from './ArticleCard';
import type {Article} from '@/api/ApiTypes';

type Props = {
  readonly article: Article;
};

export default function ArticleCardPreview(props: Props) {
  const {article} = props;
  const {_id, thumbnail, translations, length, strengths} = article;

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
            id={_id}
            thumbnail={thumbnail ?? ''}
            title={translation.title}
            description={translation.description}
            length={length}
            strengths={strengths}
            languageCode={translation.language}
            rootCategoryId={article.categoryPath[0]._id}
            isLocked={article.isLocked}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
