import {Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
import {languages} from '@/i18n.js';

type EmbedLinksSectionProperties = {
  readonly animationId: string;
};

export default function EmbedLinksSection({
  animationId,
}: EmbedLinksSectionProperties) {
  return (
    <Row className="mt-3mb-3">
      <h5>Embed Links</h5>
      <Col>
        <Form.Group controlId="embedLinks">
          {Object.keys(languages).map((lang) => (
            <InputGroup key={lang} className="mb-2">
              <InputGroup.Text style={{width: '50px'}}>
                {lang.toUpperCase()}
              </InputGroup.Text>
              <Form.Control
                readOnly
                type="text"
                value={`animation://${animationId}-${lang}`}
              />
              <Button
                variant="primary"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `animation://${animationId}-${lang}`,
                  );
                  // eslint-disable-next-line no-alert
                  alert(
                    `Embed link for ${lang.toUpperCase()} copied to clipboard!`,
                  );
                }}
              >
                Copy
              </Button>
            </InputGroup>
          ))}
        </Form.Group>
      </Col>
    </Row>
  );
}
