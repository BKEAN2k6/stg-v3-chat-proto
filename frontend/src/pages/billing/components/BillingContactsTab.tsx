import {
  Button,
  Card,
  Modal,
  OverlayTrigger,
  Spinner,
  Stack,
  Table,
  Tooltip,
} from 'react-bootstrap';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import {useId, useMemo, useState} from 'react';
import {type BillingContact, type BillingGroup} from '@client/ApiTypes';
import {BillingGroupDetails} from './BillingGroupDetails.js';
import {useGetBillingGroupQuery} from '@/hooks/useApi.js';

type BillingContactsTabProperties = {
  readonly contacts: BillingContact[];
  readonly groups: BillingGroup[];
  readonly recentContacts: BillingContact[];
  readonly isRecentContactsLoading: boolean;
  readonly deletingContactId?: string;
  readonly onAdd: () => void;
  readonly onEdit: (contact: BillingContact) => void;
  readonly onRemove: (contact: BillingContact) => void;
  readonly canRemove: (contactId: string) => boolean;
  readonly selectedContactId: string | undefined;
  readonly onSelectContact: (id: string | undefined) => void;
  readonly onReloadGroups: () => Promise<void>;
  readonly isContactModalOpen: boolean;
  readonly onAddGroupContact: (
    onCreated: (contact: BillingContact) => void,
  ) => void;
};

export function BillingContactsTab({
  contacts,
  groups,
  recentContacts,
  isRecentContactsLoading,
  deletingContactId,
  onAdd,
  onEdit,
  onRemove,
  canRemove,
  selectedContactId,
  onSelectContact,
  onReloadGroups,
  isContactModalOpen,
  onAddGroupContact,
}: BillingContactsTabProperties) {
  const minimumSearchLength = 2;
  const [contactSearchResults, setContactSearchResults] = useState<
    BillingContact[]
  >([]);
  const contactSearchId = useId();
  const [modalGroupId, setModalGroupId] = useState<string>();
  const {
    data: modalGroup,
    isFetching: isModalLoading,
    refetch: refetchModalGroup,
  } = useGetBillingGroupQuery(
    {id: modalGroupId ?? ''},
    {enabled: Boolean(modalGroupId)},
  );

  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId),
    [contacts, selectedContactId],
  );

  const groupsByContactId = useMemo(() => {
    const map = new Map<string, BillingGroup[]>();
    for (const group of groups) {
      const list = map.get(group.billingContact.id) ?? [];
      list.push(group);
      map.set(group.billingContact.id, list);
    }

    return map;
  }, [groups]);

  const handleContactSearchInput = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < minimumSearchLength) {
      setContactSearchResults([]);
      return;
    }

    const matches = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(trimmed) ||
        contact.email.toLowerCase().includes(trimmed),
    );
    setContactSearchResults(matches);
  };

  const closeGroupModal = () => {
    setModalGroupId(undefined);
  };

  const handleModalRefresh = async () => {
    if (!modalGroupId) return;
    await refetchModalGroup();
    await onReloadGroups();
  };

  return (
    <Stack gap={3}>
      <Stack gap={3}>
        <Stack direction="horizontal" gap={2}>
          <AsyncTypeahead
            className="flex-grow-1"
            id={contactSearchId}
            filterBy={() => true}
            labelKey="name"
            minLength={minimumSearchLength}
            options={contactSearchResults}
            placeholder="Search billing contacts"
            isLoading={false}
            clearButton={Boolean(selectedContact)}
            selected={selectedContact ? [selectedContact] : []}
            renderMenuItemChildren={(option) => (
              <div>
                <span>{(option as BillingContact).name}</span>
                <small className="text-muted">
                  {(option as BillingContact).email}
                </small>
              </div>
            )}
            onInputChange={handleContactSearchInput}
            onSearch={() => undefined}
            onChange={(selected) => {
              const option = selected[0];
              if (option && typeof option === 'object' && 'id' in option) {
                const contactOption = option as BillingContact;
                onSelectContact(contactOption.id);
              } else {
                onSelectContact(undefined);
              }
            }}
          />
          <Button className="flex-shrink-0" onClick={onAdd}>
            Create
          </Button>
        </Stack>

        {selectedContact ? null : (
          <Card>
            <Card.Header>
              <span className="fw-semibold">
                Recently updated billing contacts
              </span>
            </Card.Header>
            <Card.Body>
              {isRecentContactsLoading ? (
                <Stack
                  direction="horizontal"
                  gap={2}
                  className="align-items-center text-muted"
                >
                  <Spinner animation="border" size="sm" />
                  Loading recent contacts…
                </Stack>
              ) : recentContacts.length === 0 ? (
                <div className="text-muted">
                  Recent contact updates will appear here.
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover responsive size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          role="button"
                          tabIndex={0}
                          className={[
                            'cursor-pointer',
                            contact.id === selectedContactId
                              ? 'table-active'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => {
                            onSelectContact(contact.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onSelectContact(contact.id);
                            }
                          }}
                        >
                          <td className="align-middle">{contact.name}</td>
                          <td className="align-middle">{contact.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {selectedContact ? (
          <Card>
            <Card.Header>
              <Stack
                direction="horizontal"
                gap={2}
                className="justify-content-between align-items-center flex-wrap"
              >
                <span className="fw-semibold">{selectedContact.name}</span>
                <Stack direction="horizontal" gap={2}>
                  <Button
                    size="sm"
                    onClick={() => {
                      onEdit(selectedContact);
                    }}
                  >
                    Edit contact
                  </Button>
                  {canRemove(selectedContact.id) ? (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={deletingContactId === selectedContact.id}
                      onClick={() => {
                        onRemove(selectedContact);
                      }}
                    >
                      {deletingContactId === selectedContact.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'Remove contact'
                      )}
                    </Button>
                  ) : (
                    <OverlayTrigger
                      overlay={
                        <Tooltip
                          id={`contact-remove-tooltip-${selectedContact.id}`}
                        >
                          Remove or reassign their billing groups first.
                        </Tooltip>
                      }
                    >
                      <span>
                        <Button disabled variant="outline-danger" size="sm">
                          Remove contact
                        </Button>
                      </span>
                    </OverlayTrigger>
                  )}
                </Stack>
              </Stack>
            </Card.Header>
            <Card.Body>
              <Stack gap={3}>
                <div>
                  <div className="fw-semibold mb-1">Email</div>
                  <div>{selectedContact.email}</div>
                </div>
                {selectedContact.crmLink ? (
                  <div>
                    <div className="fw-semibold mb-1">CRM link</div>
                    <a
                      href={selectedContact.crmLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open CRM profile
                    </a>
                  </div>
                ) : null}
                <div>
                  <div className="fw-semibold mb-1">Notes</div>
                  {selectedContact.notes ? (
                    <div>{selectedContact.notes}</div>
                  ) : (
                    <div className="text-muted">No notes yet.</div>
                  )}
                </div>
                <div>
                  <div className="fw-semibold mb-1">Billing groups</div>
                  {groupsByContactId.get(selectedContact.id)?.length ? (
                    <div className="table-responsive">
                      <Table hover responsive size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupsByContactId
                            .get(selectedContact.id)
                            ?.map((group) => (
                              <tr key={group.id}>
                                <td className="align-middle">{group.name}</td>
                                <td className="text-end">
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => {
                                      setModalGroupId(group.id);
                                    }}
                                  >
                                    Show
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-muted">
                      No billing groups assigned.
                    </div>
                  )}
                </div>
              </Stack>
            </Card.Body>
          </Card>
        ) : null}
      </Stack>

      <Modal
        scrollable
        show={Boolean(modalGroupId)}
        size="xl"
        onHide={closeGroupModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalGroup?.name ?? 'Billing group'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isModalLoading || !modalGroup ? (
            <Stack
              direction="horizontal"
              gap={2}
              className="align-items-center text-muted"
            >
              <Spinner animation="border" size="sm" />
              Loading billing group…
            </Stack>
          ) : (
            <BillingGroupDetails
              group={modalGroup}
              isContactModalOpen={isContactModalOpen}
              onRefresh={handleModalRefresh}
              onRemoved={() => {
                void onReloadGroups();
                closeGroupModal();
              }}
              onAddContact={onAddGroupContact}
            />
          )}
        </Modal.Body>
      </Modal>
    </Stack>
  );
}
