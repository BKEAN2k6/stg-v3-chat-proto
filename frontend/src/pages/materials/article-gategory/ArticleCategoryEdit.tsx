import {Form, Row, Col, Button} from 'react-bootstrap';
import {type ArticleCategoryTranslation} from '@client/ApiTypes';
import ThumbnailUpload from '../components/ThumbnailUpload.js';
import constants from '@/constants.js';

type EditMaterialProperties = {
  readonly category: ArticleCategoryTranslation;
  readonly onChange: (updatedMaterial: ArticleCategoryTranslation) => void;
};

export default function ArticleCategoryEdit(
  properties: EditMaterialProperties,
) {
  const {category, onChange} = properties;

  const handleChange = (event: {target: {name: string; value: string}}) => {
    const {name, value} = event.target;
    onChange({...category, [name]: value});
  };

  return (
    <Form>
      <Form.Group className="mb-3" as={Row} controlId="formName">
        <Form.Label column sm="2">
          Name
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
          />
        </Col>
      </Form.Group>
      <Form.Group className="mb-3" as={Row} controlId="formDescription">
        <Form.Label column sm="2">
          Description
        </Form.Label>
        <Col sm="10">
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={category.description || ''}
            onChange={handleChange}
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
              onChange({...category, thumbnail});
            }}
          />
          {category.thumbnail ? (
            <>
              <img
                className="mt-2"
                src={`${constants.FILE_HOST}${category.thumbnail}`}
                alt="Thumbnail"
                style={{maxWidth: '320px', maxHeight: '180px'}}
              />
              <br />
              <Button
                variant="danger"
                className="mt-2"
                onClick={() => {
                  onChange({...category, thumbnail: undefined});
                }}
              >
                Remove thumbnail
              </Button>
            </>
          ) : (
            <div className="mt-2">No thumbnail</div>
          )}
        </Col>
      </Form.Group>
    </Form>
  );
}
