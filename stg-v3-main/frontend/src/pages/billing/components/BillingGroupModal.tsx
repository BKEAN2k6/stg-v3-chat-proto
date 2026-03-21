import {Button, Form, Modal, Spinner, Stack} from 'react-bootstrap';
import {type BillingContact} from '@client/ApiTypes';
import {BillingContactSelector} from './BillingContactSelector.js';

export type BillingGroupFormState = {
  name: string;
  billingContactId: string;
  billingContact?: BillingContact;
  notes?: string;
};

export const emptyGroupForm: BillingGroupFormState = {
  name: '',
  billingContactId: '',
  billingContact: undefined,
  notes: '',
};

type BillingGroupModalProperties = {
  readonly isOpen: boolean;
  readonly isSaving: boolean;
  readonly form: BillingGroupFormState;
  readonly setForm: (
    state:
      | BillingGroupFormState
      | ((previous: BillingGroupFormState) => BillingGroupFormState),
  ) => void;
  readonly onHide: () => void;
  readonly onSubmit: (data: BillingGroupFormState) => void;
  readonly onAddContact?: (
    onCreated: (contact: BillingContact) => void,
  ) => void;
};

export function BillingGroupModal({
  isOpen,
  isSaving,
  form,
  setForm,
  onHide,
  onSubmit,
  onAddContact,
}: BillingGroupModalProperties) {
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={isOpen} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {form.name ? 'Edit billing group' : 'New billing group'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <Form.Group controlId="groupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group controlId="groupContact">
              <Form.Label>Billing contact</Form.Label>
              <BillingContactSelector
                selected={form.billingContact}
                isDisabled={isSaving}
                onSelect={(contact) => {
                  setForm((previous) => ({
                    ...previous,
                    billingContactId: contact?.id ?? '',
                    billingContact: contact,
                  }));
                }}
                onCreateContact={
                  onAddContact
                    ? (onCreated) => {
                        onAddContact((created) => {
                          onCreated(created);
                        });
                      }
                    : undefined
                }
              />
            </Form.Group>
            <Form.Group controlId="groupNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.notes ?? ''}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }));
                }}
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving…
              </>
            ) : (
              'Save group'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
