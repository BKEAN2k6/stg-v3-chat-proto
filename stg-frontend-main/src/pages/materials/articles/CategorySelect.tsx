import {useLingui} from '@lingui/react';
import {useState, useEffect} from 'react';
import {Form, InputGroup, Button} from 'react-bootstrap';
import CategorySelectModal from './CategorySelectModal';
import api from '@/api/ApiClient';
import {type ArticleCategoryListItem} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly selectedCategory?: string;
  readonly onChange: (categoryId: string) => void;
};

export default function CategorySelect(props: Props) {
  const {selectedCategory, onChange} = props;
  const [categories, setCategories] = useState<ArticleCategoryListItem[]>([]);
  const [isCategorySelectModalOpen, setIsCategorySelectModalOpen] =
    useState(false);
  const {i18n} = useLingui();
  const toasts = useToasts();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await api.getArticleCategories();
        setCategories(categories.sort((a, b) => a.order - b.order));
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the article categories',
        });
      }
    };

    void getCategories();
  }, [toasts]);

  const locale = i18n.locale as LanguageCode;

  const findCategoryTitle = (
    categories: ArticleCategoryListItem[],
    categoryId: string,
  ): string | undefined => {
    for (const category of categories) {
      if (category._id === categoryId) {
        return (
          category.translations.find(
            (translation) => translation.language === locale,
          )?.name ?? category.translations[0].name
        );
      }

      if (category.subCategories) {
        const title = findCategoryTitle(category.subCategories, categoryId);
        if (title) {
          return title;
        }
      }
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    onChange(categoryId);
    setIsCategorySelectModalOpen(false);
  };

  return (
    <Form.Group controlId="categorySelect" className="mb-3">
      <InputGroup>
        <Form.Control
          readOnly
          type="text"
          placeholder="No Category Selected"
          value={
            selectedCategory
              ? (findCategoryTitle(categories, selectedCategory) ??
                'Removed Category')
              : ''
          }
          onClick={() => {
            setIsCategorySelectModalOpen(true);
          }}
        />
        <Button
          variant="primary"
          onClick={() => {
            setIsCategorySelectModalOpen(true);
          }}
        >
          Select
        </Button>
      </InputGroup>
      <CategorySelectModal
        isOpen={isCategorySelectModalOpen}
        selected={selectedCategory}
        categories={categories}
        onClose={() => {
          setIsCategorySelectModalOpen(false);
        }}
        onSelect={handleCategorySelect}
      />
    </Form.Group>
  );
}
