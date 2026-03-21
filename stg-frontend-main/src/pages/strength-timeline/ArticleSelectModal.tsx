import {Modal, Button} from 'react-bootstrap';
import {type ArticleCategoryListItem} from '@/api/ApiTypes';

type Props = {
  readonly isOpen: boolean;
  readonly selected: string;
  readonly onClose: () => void;
  readonly categories: ArticleCategoryListItem[];
  readonly onSelect: (articleId: string) => void;
};

export default function ArticleSelectModal(props: Props) {
  const {categories, onSelect, isOpen, onClose, selected} = props;

  const renderArticles = (
    articles: Array<{
      _id: string;
      order: number;
      translations: Array<{language: string; title: string}>;
    }>,
  ) => {
    return (
      <ul>
        {articles
          .sort((a, b) => a.order - b.order)
          .map((article) => {
            const articleTitle =
              article.translations.find((t) => t.language === 'en')?.title ??
              article.translations[0].title;
            return (
              <li key={article._id}>
                <Button
                  style={{
                    margin: '0',
                    padding: '0',
                    fontWeight: article._id === selected ? 'bold' : 'normal',
                  }}
                  variant="link"
                  onClick={() => {
                    onSelect(article._id);
                  }}
                >
                  {articleTitle}
                </Button>
              </li>
            );
          })}
      </ul>
    );
  };

  const renderCategories = (categories: ArticleCategoryListItem[]) => {
    return (
      <ul>
        {categories
          .sort((a, b) => a.order - b.order)
          .map((category) => {
            const categoryName =
              category.translations.find((t) => t.language === 'en')?.name ??
              category.translations[0].name;
            return (
              <li key={category._id}>
                {categoryName}

                {renderCategories(category.subCategories)}
                {renderArticles(category.articles)}
              </li>
            );
          })}
      </ul>
    );
  };

  return (
    <Modal scrollable centered show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Body>{renderCategories(categories)}</Modal.Body>
      </Modal.Body>
    </Modal>
  );
}
