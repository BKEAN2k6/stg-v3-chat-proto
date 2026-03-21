import {useEffect, useState} from 'react';
import {Button, Modal, Form, InputGroup} from 'react-bootstrap';
import {type StrengthSlug, type LanguageCode} from '@client/ApiTypes';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import {i18n} from '@lingui/core';
import {strengthTranslationMap} from '@/helpers/strengths.js';
import StrengthModal from '@/components/ui/StrengthModal.js';

type Properties = {
  readonly goal: {
    id?: string;
    strength: StrengthSlug;
    target: number;
    targetDate: string;
    description?: string;
  };
  readonly isOpen: boolean;
  readonly onHide: () => void;
  readonly onSave: (goal: {
    id?: string;
    strength: StrengthSlug;
    target: number;
    targetDate: string;
    description?: string;
  }) => void;
};

export default function GoalEditModal({
  goal,
  isOpen,
  onHide,
  onSave,
}: Properties) {
  const {_} = useLingui();
  const [description, setDescription] = useState<string | undefined>(
    goal.description,
  );
  const [strength, setStrength] = useState<StrengthSlug>(goal.strength);
  const [targetDate, setTargetDate] = useState<string>(
    goal.targetDate.split('T')[0],
  );
  const [showStrengthModal, setShowStrengthModal] = useState(false);

  useEffect(() => {
    setDescription(goal.description);
    setStrength(goal.strength);
    setTargetDate(goal.targetDate.split('T')[0]);
  }, [goal]);

  return (
    <div>
      <Modal
        show={isOpen}
        onHide={() => {
          onHide();
        }}
      >
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            onSave({
              id: goal?.id,
              strength,
              target: goal.target,
              targetDate,
              description,
            });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {goal.id ? <Trans>Edit goal</Trans> : <Trans>Create goal</Trans>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="challengeSrength">
              <Form.Label>
                <Trans>Strength</Trans>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  disabled
                  type="text"
                  name="strength"
                  value={
                    strengthTranslationMap[strength][
                      i18n.locale as LanguageCode
                    ]
                  }
                />
                {!goal.id && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowStrengthModal(true);
                    }}
                  >
                    <Trans>Select</Trans>
                  </Button>
                )}
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <Trans>Description</Trans>
              </Form.Label>
              <Form.Control
                as="textarea"
                maxLength={100}
                value={description}
                placeholder={_(msg`Add an optional description for the goal.`)}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <Trans>Target date</Trans>
              </Form.Label>
              <Form.Control
                required
                type="date"
                value={targetDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(event) => {
                  setTargetDate(event.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                onHide();
              }}
            >
              <Trans>Close</Trans>
            </Button>
            <Button variant="primary" type="submit">
              <Trans>Save Changes</Trans>
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <StrengthModal
        selectedStrengthSlugs={[]}
        isOpen={showStrengthModal}
        onClose={() => {
          setShowStrengthModal(false);
        }}
        onStrengthSelected={(strength) => {
          setStrength(strength);
          setShowStrengthModal(false);
        }}
      />
    </div>
  );
}
