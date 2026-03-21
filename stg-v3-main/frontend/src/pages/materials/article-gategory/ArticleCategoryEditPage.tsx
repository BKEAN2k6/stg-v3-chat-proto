import {useState, useEffect, useMemo, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Tab, Tabs, Button, Form, Row, Col, Breadcrumb} from 'react-bootstrap';
import api from '@client/ApiClient';
import {type ArticleCategory} from '@client/ApiTypes';
import ThumbnailUpload from '../components/ThumbnailUpload.js';
import CategorySelect from '../components/CategorySelect.js';
import ArticleCategoryTranslations from './ArticleCategoryTranslations.js';
import validateArticleCategory from './validateArticleCategory.js';
import {useToasts} from '@/components/toasts/index.js';
import constants from '@/constants.js';
import {confirm} from '@/components/ui/confirm.js';
import PageTitle from '@/components/ui/PageTitle.js';

function collectDescendantIds(category: ArticleCategory): string[] {
  return category.subCategories.flatMap((sub) => [
    sub.id,
    ...collectDescendantIds(sub),
  ]);
}

export default function ArticleCategoryEditPage() {
  const [articleCategory, setArticleCategory] = useState<ArticleCategory>();
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const initialParentCategory = useRef('');
  const toasts = useToasts();
  const {categoryId} = useParams();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!articleCategory) return;

    const errors = validateArticleCategory(articleCategory);
    if (errors.length > 0) {
      toasts.danger({header: 'Oops!', body: errors.join(' ')});
      return;
    }

    try {
      const {id, translations, thumbnail, displayAs, isHidden, isLocked} =
        articleCategory;
      const parentCategoryChanged =
        selectedParentCategory !== initialParentCategory.current;
      await api.updateArticleCategory(
        {id},
        {
          translations,
          thumbnail,
          displayAs,
          isHidden,
          isLocked,
          ...(parentCategoryChanged && {
            parentCategory:
              selectedParentCategory === ''
                ? (null as unknown as string)
                : selectedParentCategory,
          }),
        },
      );
      initialParentCategory.current = selectedParentCategory;
      toasts.success({
        header: 'Success!',
        body: 'Article category saved successfully',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the category',
      });
    }
  };

  const handleRemove = async () => {
    const confirmed = await confirm({
      title: 'Remove category',
      text: 'Are you sure you want to remove the article category.',
      confirm: 'Yes, remove',
      cancel: 'No, cancel',
      confirmVariant: 'danger',
    });
    if (!confirmed || !articleCategory) return;

    if (articleCategory.articles.length > 0) {
      toasts.danger({
        header: 'Oops!',
        body: 'You cannot delete a category with articles',
      });
      return;
    }

    if (articleCategory.subCategories.length > 0) {
      toasts.danger({
        header: 'Oops!',
        body: 'You cannot delete a category with subcategories',
      });
      return;
    }

    try {
      await api.removeArticleCategory({id: articleCategory.id});
      navigate('/articles');
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while removing the category',
      });
    }
  };

  useEffect(() => {
    if (!categoryId) return;
    const getCategory = async () => {
      try {
        const category = await api.getArticleCategory({id: categoryId});
        setArticleCategory(category);
        const parentId = category.parentCategory ?? '';
        setSelectedParentCategory(parentId);
        initialParentCategory.current = parentId;
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the category',
        });
      }
    };

    void getCategory();
  }, [categoryId, toasts]);

  const excludeCategoryIds = useMemo(
    () =>
      articleCategory
        ? [articleCategory.id, ...collectDescendantIds(articleCategory)]
        : [],
    [articleCategory],
  );

  if (!articleCategory) {
    return null;
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <PageTitle title="Edit Article Category">
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleRemove}>
            Remove
          </Button>
        </PageTitle>
        <Breadcrumb className="mt-2">
          {articleCategory.categoryPath.map((pathCategory) => (
            <Breadcrumb.Item key={pathCategory.id} active>
              {pathCategory.translations.find((t) => t.language === 'en')
                ?.name ?? pathCategory.translations[0].name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>

      <Tabs defaultActiveKey="details" id="category-details" className="mb-3">
        <Tab eventKey="details" title="Details">
          <Form>
            <Form.Group className="mb-3" as={Row} controlId="formParent">
              <Form.Label column sm="2">
                Parent Category
              </Form.Label>
              <Col sm="10">
                <CategorySelect
                  isRootSelectable
                  excludeCategoryIds={excludeCategoryIds}
                  selectedCategory={selectedParentCategory || undefined}
                  onChange={setSelectedParentCategory}
                />
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row} controlId="formDisplayAs">
              <Form.Label column sm="2">
                Display as
              </Form.Label>
              <Col sm="10">
                <Form.Select
                  value={articleCategory.displayAs}
                  onChange={(event) => {
                    setArticleCategory({
                      ...articleCategory,
                      displayAs: event.target.value as 'list' | 'grid',
                    });
                  }}
                >
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row} controlId="formHidden">
              <Form.Label column sm="2">
                Hidden
              </Form.Label>
              <Col sm="10">
                <Form.Check
                  type="checkbox"
                  checked={articleCategory.isHidden}
                  onChange={(event) => {
                    setArticleCategory({
                      ...articleCategory,
                      isHidden: event.target.checked,
                    });
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row} controlId="formLocked">
              <Form.Label column sm="2">
                Locked
              </Form.Label>
              <Col sm="10">
                <Form.Check
                  type="checkbox"
                  checked={articleCategory.isLocked}
                  onChange={(event) => {
                    setArticleCategory({
                      ...articleCategory,
                      isLocked: event.target.checked,
                    });
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row} controlId="formThumbnail">
              <Form.Label column sm="2">
                Thumbnail
              </Form.Label>
              <Col sm="10">
                <ThumbnailUpload
                  onChange={(thumbnail) => {
                    setArticleCategory({...articleCategory, thumbnail});
                  }}
                />
                {articleCategory.thumbnail ? (
                  <img
                    className="mt-2"
                    src={`${constants.FILE_HOST}${articleCategory.thumbnail}`}
                    alt="Thumbnail"
                    style={{maxWidth: '320px', maxHeight: '180px'}}
                  />
                ) : (
                  <div className="mt-2">No thumbnail</div>
                )}
              </Col>
            </Form.Group>
          </Form>
        </Tab>
        <Tab eventKey="translations" title="Translations">
          <ArticleCategoryTranslations
            translations={articleCategory.translations}
            onChange={(translations) => {
              setArticleCategory({...articleCategory, translations});
            }}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
