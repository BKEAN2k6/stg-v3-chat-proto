import {Trans} from '@lingui/react/macro';
import {Form, Row, Col, Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useState} from 'react';
import {X} from 'react-bootstrap-icons';
import {type Article, type StrengthSlug} from '@client/ApiTypes';
import CategorySelect from '../components/CategorySelect.js';
import ThumbnailUpload from '../components/ThumbnailUpload.js';
import constants from '@/constants.js';
import {slugToListItem} from '@/helpers/strengths.js';
import StrengthModal from '@/components/ui/StrengthModal.js';

type Properties = {
  readonly article: Article;
  readonly onChange: (updatedMaterial: Article) => void;
};

export default function ArticleDetailsForm(properties: Properties) {
  const {article, onChange} = properties;
  const {i18n} = useLingui();
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);

  const handleChange = (event: {target: {name: string; value: string}}) => {
    const {name, value} = event.target;
    onChange({...article, [name]: value});
  };

  const handleStrengthDeselected = (selectedSlug: StrengthSlug) => {
    const updatedStrengths = article.strengths.filter(
      (slug) => slug !== selectedSlug,
    );
    onChange({...article, strengths: updatedStrengths});
  };

  const handleStrengthSelected = (selectedStrength: StrengthSlug) => {
    const updatedStrengths = [...article.strengths, selectedStrength];
    onChange({...article, strengths: updatedStrengths});
    setIsStrengthModalOpen(false);
  };

  return (
    <Form>
      <Form.Group className="mb-3" as={Row} controlId="articleCategory">
        <Form.Label column sm="2">
          Gategory
        </Form.Label>
        <Col sm="10">
          <CategorySelect
            selectedCategory={article.category}
            onChange={(category) => {
              onChange({...article, category});
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group className="mb-3" as={Row} controlId="formLength">
        <Form.Label column sm="2">
          Length
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="length"
            value={article.length}
            onChange={handleChange}
          />
        </Col>
      </Form.Group>
      <Form.Group className="mb-3" as={Row} controlId="formStrengths">
        <Form.Label column sm="2">
          Strengths
        </Form.Label>
        <Col sm="10">
          <div className="d-flex flex-wrap gap-2 align-items-start">
            {article.strengths.map((strength) => (
              <Button key={strength} variant="outline-primary">
                {slugToListItem(strength, i18n.locale).title}
                <X
                  onClick={() => {
                    handleStrengthDeselected(strength);
                  }}
                />
              </Button>
            ))}

            <Button
              onClick={() => {
                setIsStrengthModalOpen(true);
              }}
            >
              <Trans>Add Strength</Trans>
            </Button>
          </div>
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
            checked={article.isHidden}
            onChange={(event) => {
              onChange({...article, isHidden: event.target.checked});
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
            checked={article.isLocked}
            onChange={(event) => {
              onChange({...article, isLocked: event.target.checked});
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
              onChange({...article, thumbnail});
            }}
          />
          {article.thumbnail ? (
            <img
              className="mt-2"
              src={`${constants.FILE_HOST}${article.thumbnail}`}
              alt="Thumbnail"
              style={{maxWidth: '320px', maxHeight: '180px'}}
            />
          ) : (
            <div className="mt-2">No thumbnail</div>
          )}
        </Col>
      </Form.Group>
      <StrengthModal
        isOpen={isStrengthModalOpen}
        selectedStrengthSlugs={article.strengths}
        onClose={() => {
          setIsStrengthModalOpen(false);
        }}
        onStrengthSelected={handleStrengthSelected}
      />
    </Form>
  );
}
