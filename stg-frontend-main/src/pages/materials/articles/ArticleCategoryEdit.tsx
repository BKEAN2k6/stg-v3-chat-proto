import {Form, Row, Col} from 'react-bootstrap';
import {type ArticleCategoryTranslation} from '@/api/ApiTypes';

type EditMaterialProps = {
  readonly category: ArticleCategoryTranslation;
  readonly onChange: (updatedMaterial: ArticleCategoryTranslation) => void;
};

export default function ArticleCategoryEdit(props: EditMaterialProps) {
  const {category, onChange} = props;

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
    </Form>
  );
}
