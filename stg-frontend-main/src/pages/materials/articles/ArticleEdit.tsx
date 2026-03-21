import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ArticleDetailsForm from './ArticleDetailsForm';
import ArticleTranslations from './ArticleTranslations';
import ArticlePreview from './ArticlePreview';
import ArticleCardPreview from './ArticleCardPreview';
import {type Article} from '@/api/ApiTypes';

type Props = {
  readonly article: Article;
  readonly onChange: (article: Article) => void;
};

export default function ArticleEdit(props: Props) {
  const {article, onChange} = props;

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
          onChange={(translations) => {
            onChange({...article, translations});
          }}
        />
      </Tab>
      <Tab eventKey="content-preview" title="Content Preview">
        <ArticlePreview article={article} />
      </Tab>
      <Tab eventKey="card-preview" title="Card preview">
        <ArticleCardPreview article={article} />
      </Tab>
    </Tabs>
  );
}
