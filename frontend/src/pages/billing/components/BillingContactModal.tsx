import {type Dispatch, type SetStateAction} from 'react';
import {Button, Form, Modal, Stack} from 'react-bootstrap';
import {type CreateBillingContactRequest} from '@client/ApiTypes';

export type BillingContactFormState = CreateBillingContactRequest & {
  id?: string;
};

export const emptyContactForm: BillingContactFormState = {
  name: '',
  email: '',
  crmLink: '',
  notes: '',
};

type BillingContactModalProperties = {
  readonly isOpen: boolean;
  readonly isSaving: boolean;
  readonly contactForm: BillingContactFormState;
  readonly setContactForm: Dispatch<SetStateAction<BillingContactFormState>>;
  readonly onHide: () => void;
  readonly onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

export function BillingContactModal({
  isOpen,
  isSaving,
  contactForm,
  setContactForm,
  onHide,
  onSubmit,
}: BillingContactModalProperties) {
  return (
    <Modal show={isOpen} onHide={onHide}>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {contactForm.id ? 'Edit billing contact' : 'New billing contact'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <Form.Group controlId="contactName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={contactForm.name}
                onChange={(event) => {
                  setContactForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group controlId="contactEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                value={contactForm.email}
                onChange={(event) => {
                  setContactForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group controlId="contactPhone">
              <Form.Label>CRM link</Form.Label>
              <Form.Control
                value={contactForm.crmLink ?? ''}
                placeholder="https://crm.example.com/contact/123"
                onChange={(event) => {
                  setContactForm((previous) => ({
                    ...previous,
                    crmLink: event.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group controlId="contactNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={contactForm.notes ?? ''}
                onChange={(event) => {
                  setContactForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }));
                }}
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              onHide();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save contact'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
