import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Tab, Tabs, Button, Form, Row, Col} from 'react-bootstrap';
import ArticleCategoryTranslations from './ArticleCategoryTranslations';
import ThumbnailUpload from './ThumbnailUpload';
import validateArticleCategory from './validateArticleCategory';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {type ArticleCategory} from '@/api/ApiTypes';
import constants from '@/constants';
import {useTitle} from '@/context/pageTitleContext';
import {confirm} from '@/components/ui/confirm';

export default function ArticleCategoryEditPage() {
  const {setTitle} = useTitle();
  const [articleCategory, setArticleCategory] = useState<ArticleCategory>();
  const toasts = useToasts();
  const {categoryId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Edit Article Category');
  }, [setTitle]);

  const handleSave = async () => {
    if (!articleCategory) {
      return;
    }

    const errors = validateArticleCategory(articleCategory);

    if (errors.length > 0) {
      toasts.danger({
        header: 'Oops!',
        body: errors.join(' '),
      });
      return;
    }

    try {
      const {translations, thumbnail, displayAs, order, isHidden, isLocked} =
        articleCategory;

      await api.updateArticleCategory(
        {
          id: articleCategory._id,
        },
        {
          translations,
          thumbnail,
          displayAs,
          order,
          isHidden,
          isLocked,
        },
      );

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

    if (!confirmed) {
      return;
    }

    if (!articleCategory) {
      return;
    }

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
      await api.removeArticleCategory({id: articleCategory._id});
      navigate('/articles');
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while removing the category',
      });
    }
  };

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const getCategory = async () => {
      try {
        const category = await api.getArticleCategory({id: categoryId});
        setArticleCategory(category);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while saving the material',
        });
      }
    };

    void getCategory();
  }, [categoryId, toasts]);

  if (!articleCategory) {
    return null;
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h1>Edit Article Category</h1>
        </div>
        <div>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="details" id="category-details" className="mb-3">
        <Tab eventKey="details" title="Details">
          <Form>
            <Form.Group className="mb-3" as={Row} controlId="formDisplayAs">
              <Form.Label column sm="2">
                Display as
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  value={articleCategory.displayAs}
                  onChange={(event) => {
                    setArticleCategory({
                      ...articleCategory,
                      displayAs: event.target
                        .value as ArticleCategory['displayAs'],
                    });
                  }}
                >
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row} controlId="formHidden">
              <Form.Label column sm="2">
                Hidden
              </Form.Label>
              <Col sm="10">
                <Form.Check
                  type="checkbox"
                  name="isHidden"
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
                  name="isLocked"
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
                    setArticleCategory({
                      ...articleCategory,
                      thumbnail,
                    });
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
              setArticleCategory({
                ...articleCategory,
                translations,
              });
            }}
          />
        </Tab>
      </Tabs>
    </>
  );
}
