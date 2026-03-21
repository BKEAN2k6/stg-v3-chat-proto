import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import TimezoneSelect from 'react-timezone-select';
import {
  type LanguageCode,
  type CreateCommunityResponse,
  type BillingGroup,
  type BillingContact,
  type CreateBillingGroupRequest,
  type CreateBillingContactRequest,
} from '@client/ApiTypes';
import {
  useCreateBillingContactMutation,
  useCreateBillingGroupMutation,
  useCreateCommunityMutation,
  useUpdateCommunityBillingGroupMutation,
  useUpdateCommunitySubscriptionMutation,
} from '@client/ApiHooks.js';
import {normalizeOptionalText} from './billingUtils.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useToasts} from '@/components/toasts/index.js';
import {
  BillingContactModal,
  emptyContactForm,
  type BillingContactFormState,
} from '@/pages/billing/components/BillingContactModal.js';
import {BillingGroupSelector} from '@/pages/billing/components/BillingGroupSelector.js';
import {
  BillingGroupModal,
  emptyGroupForm,
  type BillingGroupFormState,
} from '@/pages/billing/components/BillingGroupModal.js';

const toInputDateTimeValue = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const pad = (input: number) => String(input).padStart(2, '0');
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(
    parsed.getDate(),
  )}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
};

type Properties = {
  readonly onCommunityCreate: (community: CreateCommunityResponse) => void;
  readonly isOpen: boolean;
  readonly handleClose: () => void;
  readonly initialBillingGroup?: BillingGroup;
};

export default function CreateCommunityModal(properties: Properties) {
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();
  const createBillingContact = useCreateBillingContactMutation();
  const createBillingGroup = useCreateBillingGroupMutation();
  const createCommunity = useCreateCommunityMutation();
  const updateCommunitySubscription = useUpdateCommunitySubscriptionMutation();
  const updateCommunityBillingGroup = useUpdateCommunityBillingGroupMutation();

  const {onCommunityCreate, isOpen, handleClose, initialBillingGroup} =
    properties;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [timezone, setTimezone] = useState<string>('Etc/GMT');
  const [statusValidUntil, setStatusValidUntil] = useState('');
  const [selectedBillingGroup, setSelectedBillingGroup] = useState<
    BillingGroup | undefined
  >(initialBillingGroup);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] =
    useState<BillingGroupFormState>(emptyGroupForm);
  const [savingGroup, setSavingGroup] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] =
    useState<BillingContactFormState>(emptyContactForm);
  const [savingContact, setSavingContact] = useState(false);
  const [onContactCreated, setOnContactCreated] = useState<
    ((contact: BillingContact) => void) | undefined
  >(undefined);

  const resetForm = () => {
    setName('');
    setDescription('');
    setLanguage('en');
    setTimezone('Etc/GMT');
    setSelectedBillingGroup(initialBillingGroup);
    setStatusValidUntil('');
  };

  const handleSave = async () => {
    if (!currentUser) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName || !trimmedDescription) {
      toasts.danger({
        header: 'Missing information',
        body: 'Provide both a name and description.',
      });
      return;
    }

    let statusValidUntilDate: Date | undefined;
    if (statusValidUntil) {
      statusValidUntilDate = new Date(statusValidUntil);
      if (Number.isNaN(statusValidUntilDate.getTime())) {
        toasts.danger({
          header: 'Invalid date',
          body: 'Select a valid status valid until date.',
        });
        return;
      }
    }

    try {
      const community = await createCommunity.mutateAsync({
        payload: {
          name: trimmedName,
          description: trimmedDescription,
          language,
          timezone,
        },
      });

      if (statusValidUntilDate) {
        try {
          await updateCommunitySubscription.mutateAsync({
            pathParameters: {id: community.id},
            payload: {statusValidUntil: statusValidUntilDate.toISOString()},
          });
        } catch {
          toasts.danger({
            header: 'Partial success',
            body: 'Community created but updating the subscription failed.',
          });
        }
      }

      if (selectedBillingGroup) {
        try {
          await updateCommunityBillingGroup.mutateAsync({
            pathParameters: {id: community.id},
            payload: {billingGroupId: selectedBillingGroup.id},
          });
        } catch {
          toasts.danger({
            header: 'Partial success',
            body: 'Community created but assigning the billing group failed.',
          });
        }
      }

      resetForm();
      handleClose();
      onCommunityCreate(community);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the community',
      });
    }
  };

  const openCreateGroupModal = () => {
    setGroupForm(emptyGroupForm);
    setGroupModalOpen(true);
  };

  const closeCreateGroupModal = () => {
    setGroupModalOpen(false);
    setGroupForm(emptyGroupForm);
  };

  const handleContactSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      toasts.danger({
        header: 'Missing information',
        body: 'Please provide a name and email for the billing contact.',
      });
      return;
    }

    setSavingContact(true);
    try {
      const payload: CreateBillingContactRequest = {
        name: contactForm.name,
        email: contactForm.email,
        crmLink: normalizeOptionalText(contactForm.crmLink),
        notes: normalizeOptionalText(contactForm.notes),
      };
      const created = await createBillingContact.mutateAsync({payload});
      toasts.success({
        header: 'Contact created',
        body: `${created.name} has been added.`,
      });
      onContactCreated?.(created);
      setIsContactModalOpen(false);
      setContactForm(emptyContactForm);
      setOnContactCreated(undefined);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Saving the billing contact failed.',
      });
    } finally {
      setSavingContact(false);
    }
  };

  const handleCreateGroupSubmit = async (data: BillingGroupFormState) => {
    if (!data.name || !data.billingContactId) {
      toasts.danger({
        header: 'Missing information',
        body: 'Please provide a name and billing contact for the group.',
      });
      return;
    }

    setSavingGroup(true);
    try {
      const payload: CreateBillingGroupRequest = {
        name: data.name,
        billingContactId: data.billingContactId,
        notes: normalizeOptionalText(data.notes),
      };
      const created = await createBillingGroup.mutateAsync({payload});
      setSelectedBillingGroup(created);
      toasts.success({
        header: 'Billing group created',
        body: `${created.name} has been added.`,
      });
      closeCreateGroupModal();
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Saving the billing group failed.',
      });
    } finally {
      setSavingGroup(false);
    }
  };

  return (
    <>
      <Modal
        show={isOpen}
        className={`px-4 ${groupModalOpen ? 'd-none' : ''}`}
        onHide={() => {
          resetForm();
          handleClose();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="community-name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter name"
                value={name}
                maxLength={50}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="community-descriptiion" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter description"
                value={description}
                maxLength={500}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="community-language" className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Control
                as="select"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value as LanguageCode);
                }}
              >
                <option value="en">English</option>
                <option value="fi">Finnish</option>
                <option value="sv">Swedish</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="community-timezone" className="mb-3">
              <Form.Label>Timezone</Form.Label>
              <TimezoneSelect
                value={timezone}
                onChange={({value}) => {
                  setTimezone(value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="community-billing-group" className="mb-3">
              <Form.Label>Billing group (optional)</Form.Label>
              <BillingGroupSelector
                selected={selectedBillingGroup}
                onSelect={(group) => {
                  setSelectedBillingGroup(group);
                  if (group && !statusValidUntil && group.lastSubscriptionEnd) {
                    setStatusValidUntil(
                      toInputDateTimeValue(group.lastSubscriptionEnd),
                    );
                  }
                }}
                onCreateGroup={openCreateGroupModal}
              />
            </Form.Group>
            <Form.Group controlId="community-subscription-end" className="mb-3">
              <Form.Label>Status valid until (optional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={statusValidUntil}
                onChange={(event) => {
                  setStatusValidUntil(event.target.value);
                }}
              />
              <Form.Text className="text-muted">
                Leave empty to skip setting a status valid until date.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <BillingGroupModal
        isOpen={groupModalOpen ? !isContactModalOpen : false}
        isSaving={savingGroup}
        form={groupForm}
        setForm={setGroupForm}
        onHide={closeCreateGroupModal}
        onSubmit={handleCreateGroupSubmit}
        onAddContact={(onCreated) => {
          setContactForm(emptyContactForm);
          setOnContactCreated(() => (contact: BillingContact) => {
            onCreated(contact);
          });
          setIsContactModalOpen(true);
        }}
      />

      <BillingContactModal
        isOpen={isContactModalOpen}
        isSaving={savingContact}
        contactForm={contactForm}
        setContactForm={setContactForm}
        onHide={() => {
          setIsContactModalOpen(false);
          setContactForm(emptyContactForm);
          setOnContactCreated(undefined);
        }}
        onSubmit={handleContactSubmit}
      />
    </>
  );
}
