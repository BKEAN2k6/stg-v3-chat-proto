import {Modal, Button} from 'react-bootstrap';
import {type ArticleCategoryListItem} from '@client/ApiTypes';

type Properties = {
  readonly isOpen: boolean;
  readonly selected: string | undefined;
  readonly categories: ArticleCategoryListItem[];
  readonly onClose: () => void;
  readonly onSelect: (categoryId: string) => void;
  readonly isRootSelectable?: boolean;
  readonly excludeCategoryIds?: string[];
};

export default function CategorySelectModal(properties: Properties) {
  const {
    onSelect,
    isOpen,
    onClose,
    selected,
    categories,
    isRootSelectable,
    excludeCategoryIds,
  } = properties;

  const renderCategories = (categories: ArticleCategoryListItem[]) => {
    const filtered = excludeCategoryIds
      ? categories.filter(
          (category) => !excludeCategoryIds.includes(category.id),
        )
      : categories;

    return (
      <ul>
        {filtered
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
        {isRootSelectable === true && (
          <Button
            style={{
              margin: '0',
              padding: '0',
              fontWeight: selected === undefined ? 'bold' : 'normal',
            }}
            variant="link"
            onClick={() => {
              onSelect('');
            }}
          >
            Root (no parent)
          </Button>
        )}
        {renderCategories(categories)}
      </Modal.Body>
    </Modal>
  );
}
