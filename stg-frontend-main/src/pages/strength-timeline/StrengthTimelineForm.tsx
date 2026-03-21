import {useState} from 'react';
import {Form, InputGroup, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ArticleSelectModal from './ArticleSelectModal';
import {type ArticleCategoryListItem} from '@/api/ApiTypes';

type Props = {
  readonly stateName: string;
  readonly timelineItem: {
    _id: string;
    start: string;
    articleId: string;
    rootCategoryId: string;
  };
  readonly onChange: (timelineItem: {
    _id: string;
    start: string;
    articleId: string;
    rootCategoryId: string;
  }) => void;
  readonly categories: ArticleCategoryListItem[];
};

const findArticleTitle = (
  categories: ArticleCategoryListItem[],
  articleId: string,
): string | undefined => {
  for (const category of categories) {
    if (category.articles) {
      const article = category.articles.find(
        (article) => article._id === articleId,
      );
      if (article) {
        return (
          article.translations.find(
            (translation) => translation.language === 'en',
          )?.title ?? article.translations[0].title
        );
      }
    }

    if (category.subCategories) {
      const article = findArticleTitle(category.subCategories, articleId);
      if (article) {
        return article;
      }
    }
  }
};

export default function StrengthTimelineForm(props: Props) {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const {
    stateName,
    timelineItem,
    categories: articleCategories,
    onChange,
  } = props;

  const onTimelineItemStartChange = async (value: Date) => {
    value.setHours(0, 0, 0, 0);
    onChange({...timelineItem, start: value.toISOString()});
  };

  const onTimelineItemArticleChange = (value: string) => {
    setIsArticleModalOpen(false);
    onChange({...timelineItem, articleId: value});
  };

  return (
    <div key={timelineItem._id}>
      <div className="d-flex gap-1">
        <div
          className="py-2"
          style={{
            width: 60,
          }}
        >
          {stateName}
        </div>
        <div
          style={{
            width: 110,
          }}
        >
          <DatePicker
            className="form-control"
            dateFormat="dd/MM/yyyy"
            selected={new Date(timelineItem.start)}
            onChange={async (date) => {
              if (!date) {
                return;
              }

              void onTimelineItemStartChange(date);
            }}
          />
        </div>
        <div className="flex-grow-1">
          <Form.Group controlId="formBasicArticle" className="mb-3">
            <InputGroup>
              <Form.Control
                readOnly
                type="text"
                placeholder="No Article Selected"
                value={
                  timelineItem.articleId
                    ? (findArticleTitle(
                        articleCategories,
                        timelineItem.articleId,
                      ) ?? 'Removed Article')
                    : ''
                }
                onClick={() => {
                  setIsArticleModalOpen(true);
                }}
              />
              <Button
                variant="primary"
                onClick={() => {
                  setIsArticleModalOpen(true);
                }}
              >
                Select
              </Button>
            </InputGroup>
          </Form.Group>
        </div>
        <ArticleSelectModal
          selected={timelineItem.articleId}
          isOpen={isArticleModalOpen}
          categories={articleCategories}
          onClose={() => {
            setIsArticleModalOpen(false);
          }}
          onSelect={onTimelineItemArticleChange}
        />
      </div>
    </div>
  );
}
