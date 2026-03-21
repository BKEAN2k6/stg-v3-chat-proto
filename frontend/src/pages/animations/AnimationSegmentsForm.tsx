import {type Dispatch, type SetStateAction} from 'react';
import {Card, Row, Col, Form, Button} from 'react-bootstrap';
import {ArrowUp, ArrowDown} from 'react-bootstrap-icons';
import {type AnimationSegment} from '@client/ApiTypes.js';

type SegmentsEditorProperties = {
  readonly segments: AnimationSegment[];
  readonly setSegments: Dispatch<SetStateAction<AnimationSegment[]>>;
  readonly maxFrame: number;
  readonly isDisabled?: boolean;
  readonly applyChanges: () => void;
};

export default function AnimationSegmentsForm({
  segments,
  setSegments,
  applyChanges,
  maxFrame,
  isDisabled = false,
}: SegmentsEditorProperties) {
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setSegments((previous) => {
      const copy = [...previous];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index < 0 || index >= segments.length - 1) return;
    setSegments((previous) => {
      const copy = [...previous];
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      return copy;
    });
  };

  const handleFieldChange = (
    index: number,
    field: keyof AnimationSegment,
    value: number | boolean,
  ) => {
    setSegments((previous) => {
      const copy = [...previous];
      copy[index] = {
        ...copy[index],
        [field]:
          typeof value === 'number'
            ? Math.min(Math.max(value, 0), maxFrame)
            : value,
      };
      return copy;
    });
  };

  const handleDelete = (index: number) => {
    setSegments((previous) => previous.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setSegments((previous) => [
      ...previous,
      {
        start: 0,
        stop: maxFrame,
        autoplay: false,
        loop: false,
        showToolbar: false,
      },
    ]);
  };

  return (
    <>
      {segments.length === 0 && (
        <p className="text-muted">No segments defined yet.</p>
      )}

      {segments.map((seg, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Card key={index} className="mb-2">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Segment {index + 1}</strong>
              </div>
              <div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  disabled={index === 0 || isDisabled}
                  title="Move Up"
                  onClick={() => {
                    handleMoveUp(index);
                  }}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  title="Move Down"
                  disabled={index === segments.length - 1 || isDisabled}
                  onClick={() => {
                    handleMoveDown(index);
                  }}
                >
                  <ArrowDown />
                </Button>
              </div>
            </div>
          </Card.Header>

          <Card.Body>
            <Row className="align-items-end">
              <Col md={2}>
                <Form.Group controlId={`segment-start-${index}`}>
                  <Form.Label>Start</Form.Label>
                  <Form.Control
                    type="number"
                    value={seg.start}
                    min={0}
                    max={maxFrame}
                    disabled={isDisabled}
                    onChange={(event) => {
                      handleFieldChange(
                        index,
                        'start',
                        Number(event.target.value),
                      );
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId={`segment-stop-${index}`}>
                  <Form.Label>Stop</Form.Label>
                  <Form.Control
                    type="number"
                    value={seg.stop}
                    min={0}
                    max={maxFrame}
                    disabled={isDisabled}
                    onChange={(event) => {
                      handleFieldChange(
                        index,
                        'stop',
                        Number(event.target.value),
                      );
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId={`segment-autoplay-${index}`}>
                  <Form.Check
                    type="checkbox"
                    label="Autoplay"
                    checked={Boolean(seg.autoplay)}
                    disabled={isDisabled}
                    onChange={(event) => {
                      handleFieldChange(
                        index,
                        'autoplay',
                        event.target.checked,
                      );
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId={`segment-loop-${index}`}>
                  <Form.Check
                    type="checkbox"
                    label="Loop"
                    checked={Boolean(seg.loop)}
                    disabled={isDisabled}
                    onChange={(event) => {
                      handleFieldChange(index, 'loop', event.target.checked);
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId={`segment-toolbar-${index}`}>
                  <Form.Check
                    type="checkbox"
                    label="Show Toolbar"
                    checked={Boolean(seg.showToolbar)}
                    disabled={isDisabled}
                    onChange={(event) => {
                      handleFieldChange(
                        index,
                        'showToolbar',
                        event.target.checked,
                      );
                    }}
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="text-end">
                <Button
                  variant="outline-danger"
                  disabled={isDisabled}
                  onClick={() => {
                    handleDelete(index);
                  }}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <div className="d-flex gap-2 mt-2 mb-3 justify-content-end">
        <Button variant="primary" disabled={isDisabled} onClick={handleAdd}>
          + Add Segment
        </Button>

        <Button
          variant="success"
          disabled={isDisabled || segments.length === 0}
          onClick={applyChanges}
        >
          Apply Changes
        </Button>
      </div>
    </>
  );
}
