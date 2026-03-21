import {Tab, Tabs} from 'react-bootstrap';
import ArticleView from './ArticleView';
import {type Article} from '@/api/ApiTypes';

type Props = {
  readonly article: Article;
};

export default function ArticlePreview(props: Props) {
  const {article} = props;
  const {translations, length, strengths} = article;

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
            article={translation}
            length={length}
            strengths={strengths}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
