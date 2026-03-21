import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Tab, Tabs, Button, Form, Row, Col} from 'react-bootstrap';
import {type ArticleCategoryTranslation} from '@client/ApiTypes';
import api from '@client/ApiClient';
import CategorySelect from '../components/CategorySelect.js';
import ThumbnailUpload from '../components/ThumbnailUpload.js';
import ArticleCategoryTranslations from './ArticleCategoryTranslations.js';
import validateArticleCategory from './validateArticleCategory.js';
import {useToasts} from '@/components/toasts/index.js';
import constants from '@/constants.js';
import {useTitle} from '@/context/pageTitleContext.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ArticleCategoryCreatePage() {
  const {setTitle} = useTitle();
  const [translations, setTranslations] = useState<
    ArticleCategoryTranslation[]
  >([]);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [displayAs, setDisplayAs] = useState<'list' | 'grid'>('list');
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [parentCategory, setParentCategory] = useState<string>('');

  const toasts = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Create Article Category');
  }, [setTitle]);

  const handleSave = async () => {
    const articleCategory = {
      parentCategory,
      translations,
      thumbnail,
      displayAs,
      isHidden,
      isLocked,
      order: 0,
    };

    const errors = validateArticleCategory(articleCategory);

    if (errors.length > 0) {
      toasts.danger({
        header: 'Oops!',
        body: errors.join(' '),
      });
      return;
    }

    try {
      await api.createArticleCategory(articleCategory);
      navigate('/materials');
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the material',
      });
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Create Article Category">
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </PageTitle>
      <Tabs defaultActiveKey="details" id="category-details" className="mb-3">
        <Tab eventKey="details" title="Details">
          <Form>
            <Form.Group className="mb-3" as={Row}>
              <Form.Label column sm="2">
                Gategory
              </Form.Label>
              <Col sm="10">
                <CategorySelect
                  selectedCategory={parentCategory}
                  onChange={(category) => {
                    setParentCategory(category);
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group className="mb-3" as={Row} controlId="formDisplayAs">
              <Form.Label column sm="2">
                Display as
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  value={displayAs}
                  onChange={(event) => {
                    setDisplayAs(event.target.value as 'list' | 'grid');
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
                  checked={isHidden}
                  onChange={(event) => {
                    setIsHidden(event.target.checked);
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
                  checked={isLocked}
                  onChange={(event) => {
                    setIsLocked(event.target.checked);
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
                  onChange={(thumb) => {
                    setThumbnail(thumb);
                  }}
                />
                {thumbnail ? (
                  <img
                    className="mt-2"
                    src={`${constants.FILE_HOST}${thumbnail}`}
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
            translations={translations}
            onChange={setTranslations}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
