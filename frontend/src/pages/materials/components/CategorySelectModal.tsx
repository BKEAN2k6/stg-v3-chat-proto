import {Modal, Button} from 'react-bootstrap';
import {type ArticleCategoryListItem} from '@client/ApiTypes';

type Properties = {
  readonly isOpen: boolean;
  readonly selected: string | undefined;
  readonly categories: ArticleCategoryListItem[];
  readonly onClose: () => void;
  readonly onSelect: (categoryId: string) => void;
};

export default function CategorySelectModal(properties: Properties) {
  const {onSelect, isOpen, onClose, selected, categories} = properties;

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
              <li key={category.id}>
                <Button
                  style={{
                    margin: '0',
                    padding: '0',
                    fontWeight: category.id === selected ? 'bold' : 'normal',
                  }}
                  variant="link"
                  onClick={() => {
                    onSelect(category.id);
                  }}
                >
                  {categoryName}
                </Button>

                {renderCategories(category.subCategories)}
              </li>
            );
          })}
      </ul>
    );
  };

  return (
    <Modal scrollable centered show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Body>{renderCategories(categories)}</Modal.Body>
      </Modal.Body>
    </Modal>
  );
}
