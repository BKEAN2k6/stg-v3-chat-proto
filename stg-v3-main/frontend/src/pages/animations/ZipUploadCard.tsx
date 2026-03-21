import {type ChangeEvent} from 'react';
import {Form, Card} from 'react-bootstrap';

type InitialZipUploadCardProperties = {
  readonly onFileUpload: (
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
};

export default function ZipUploadCard({
  onFileUpload,
}: InitialZipUploadCardProperties) {
  return (
    <Card className="mt-3">
      <Card.Header>Start New Animation</Card.Header>
      <Card.Body>
        <Form.Group controlId="zipUpload">
          <Form.Label>
            Upload a Lottie JSON with assets in a ZIP file to begin.
          </Form.Label>
          <Form.Control type="file" accept=".zip" onChange={onFileUpload} />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}
