import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {useEffect, useState} from 'react';
import {Button, Modal, Spinner, Table} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import api from '@client/ApiClient';
import {
  type BillingContact,
  type BillingGroup,
  type CreateBillingContactRequest,
  type CreateBillingGroupRequest,
  type GetCommunitySubscriptionResponse,
  type SubscriptionHistoryEntry,
  type SubscriptionStatus,
} from '@client/ApiTypes';
import {useQueryClient} from '@tanstack/react-query';
import {
  useGetCommunityQuery,
  useCreateBillingContactMutation,
  useCreateBillingGroupMutation,
  useUpdateCommunityBillingGroupMutation,
  useUpdateCommunitySubscriptionMutation,
} from '@client/ApiHooks.js';
import {useToasts} from '@/components/toasts/index.js';
import {
  BillingContactModal,
  emptyContactForm,
  type BillingContactFormState,
} from '@/pages/billing/components/BillingContactModal.js';
import {BillingGroupDetails} from '@/pages/billing/components/BillingGroupDetails.js';
import {BillingGroupSelector} from '@/pages/billing/components/BillingGroupSelector.js';
import {BillingContactSelector} from '@/pages/billing/components/BillingContactSelector.js';

const toInputDateValue = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toISOString().slice(0, 10);
};

const formatDateTime = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString();
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString();
};

const subscriptionStatuses: SubscriptionStatus[] = [
  'free-trial',
  'active-online',
  'active-manual',
  'grace',
  'expired',
];

const getStatusLabel = (
  _: ReturnType<typeof useLingui>['_'],
): Record<SubscriptionStatus, string> => ({
  'free-trial': _(msg`Free trial`),
  'active-online': _(msg`Active (online billing)`),
  'active-manual': _(msg`Active (manual billing)`),
  grace: _(msg`Grace period`),
  expired: _(msg`Expired`),
});

type Properties = {
  readonly communityId: string;
};

// eslint-disable-next-line complexity
export default function CommunitySubscription({communityId}: Properties) {
  const {_} = useLingui();
  const statusLabels = getStatusLabel(_);
  const toasts = useToasts();
  const queryClient = useQueryClient();
  const createBillingContact = useCreateBillingContactMutation();
  const createBillingGroup = useCreateBillingGroupMutation();
  const updateSubscription = useUpdateCommunitySubscriptionMutation();
  const updateBillingGroup = useUpdateCommunityBillingGroupMutation();

  // Single state object representing the server contract
  const [subscription, setSubscription] =
    useState<GetCommunitySubscriptionResponse>({
      history: [],
      subscriptionEnds: false,
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBillingGroup, setSelectedBillingGroup] = useState<
    BillingGroup | undefined
  >();
  const [initialBillingGroupId, setInitialBillingGroupId] = useState('');
  const [isBillingGroupDetailsLoading, setIsBillingGroupDetailsLoading] =
    useState(false);
  const [isBillingGroupDetailsOpen, setIsBillingGroupDetailsOpen] =
    useState(false);
  const [billingGroupDetails, setBillingGroupDetails] =
    useState<BillingGroup>();
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState<{
    name: string;
    billingContactId: string;
    billingContact?: BillingContact;
    notes?: string;
  }>({
    name: '',
    billingContactId: '',
    billingContact: undefined,
    notes: '',
  });

  const communityQuery = useGetCommunityQuery({id: communityId}, {});
  const communityData = communityQuery.data;
  const [savingGroup, setSavingGroup] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] =
    useState<BillingContactFormState>(emptyContactForm);
  const [savingContact, setSavingContact] = useState(false);
  const [onContactCreated, setOnContactCreated] = useState<
    ((contact: BillingContact) => void) | undefined
  >(undefined);
  const formattedUpdatedAt = formatDateTime(subscription.updatedAt);
  const statusValue: SubscriptionStatus | '' = subscription.status ?? '';
  const updatedByName = subscription.updatedBy
    ? `${subscription.updatedBy.firstName} ${subscription.updatedBy.lastName}`
    : '';
  const updatedSummary =
    updatedByName && formattedUpdatedAt
      ? _(msg`Updated by ${updatedByName} · ${formattedUpdatedAt}`)
      : updatedByName
        ? _(msg`Updated by ${updatedByName}`)
        : formattedUpdatedAt
          ? _(msg`Updated ${formattedUpdatedAt}`)
          : '';
  const historyEntries: SubscriptionHistoryEntry[] =
    subscription.history && subscription.history.length > 0
      ? [...subscription.history].sort((first, second) => {
          const firstTime = first.updatedAt
            ? new Date(first.updatedAt).getTime()
            : 0;
          const secondTime = second.updatedAt
            ? new Date(second.updatedAt).getTime()
            : 0;
          return secondTime - firstTime;
        })
      : [];

  useEffect(() => {
    if (subscription.statusValidUntil) return;
    if (!selectedBillingGroup?.lastSubscriptionEnd) return;

    setSubscription((previous) =>
      previous.statusValidUntil
        ? previous
        : {
            ...previous,
            statusValidUntil: selectedBillingGroup.lastSubscriptionEnd,
          },
    );
  }, [selectedBillingGroup, subscription.statusValidUntil]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const subscriptionData = await api.getCommunitySubscription({
          id: communityId,
        });
        if (!mounted) return;
        setSubscription(
          subscriptionData
            ? {
                ...subscriptionData,
                history: subscriptionData.history ?? [],
              }
            : {history: []},
        );
      } catch {
        if (mounted) {
          toasts.danger({
            header: _(msg`Oops!`),
            body: _(msg`Failed to load subscription`),
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [communityId, _, toasts]);

  useEffect(() => {
    let mounted = true;
    const billingGroupId = communityData?.billingGroup ?? '';
    setInitialBillingGroupId(billingGroupId);
    if (!billingGroupId) {
      setSelectedBillingGroup(undefined);
      return undefined;
    }

    (async () => {
      try {
        const billingGroup = await api.getBillingGroup({id: billingGroupId});
        if (!mounted) return;
        setSelectedBillingGroup(billingGroup);
        setBillingGroupDetails(billingGroup);
      } catch {
        if (mounted) setSelectedBillingGroup(undefined);
      } finally {
        if (mounted) setIsBillingGroupDetailsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [communityData]);

  const resetBillingGroupForm = () => {
    setGroupForm({
      name: '',
      billingContactId: '',
      billingContact: undefined,
      notes: '',
    });
  };

  const openCreateGroupModal = () => {
    resetBillingGroupForm();
    setGroupModalOpen(true);
  };

  const closeCreateGroupModal = () => {
    setGroupModalOpen(false);
    resetBillingGroupForm();
  };

  const normalizeOptionalText = (value?: string) =>
    value && value.trim().length > 0 ? value : undefined;

  const handleContactSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      toasts.danger({
        header: _(msg`Missing information`),
        body: _(msg`Please provide a name and email for the billing contact.`),
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
      await queryClient.invalidateQueries({
        queryKey: ['billingContact', 'list'],
      });
      toasts.success({
        header: _(msg`Contact created`),
        body: _(msg`${created.name} has been added.`),
      });
      onContactCreated?.(created);
      setIsContactModalOpen(false);
      setContactForm(emptyContactForm);
      setOnContactCreated(undefined);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Saving the billing contact failed.`),
      });
    } finally {
      setSavingContact(false);
    }
  };

  const handleCreateGroupSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!groupForm.name || !groupForm.billingContactId) {
      toasts.danger({
        header: _(msg`Missing information`),
        body: _(msg`Please provide a name and billing contact for the group.`),
      });
      return;
    }

    setSavingGroup(true);
    try {
      const payload: CreateBillingGroupRequest = {
        name: groupForm.name,
        billingContactId: groupForm.billingContactId,
        notes: normalizeOptionalText(groupForm.notes),
      };
      const created = await createBillingGroup.mutateAsync({payload});
      await queryClient.invalidateQueries({
        queryKey: ['billingGroup', 'list'],
      });
      setSelectedBillingGroup(created);
      toasts.success({
        header: _(msg`Billing group created`),
        body: _(msg`${created.name} has been added.`),
      });
      closeCreateGroupModal();
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Saving the billing group failed.`),
      });
    } finally {
      setSavingGroup(false);
    }
  };

  const handleSave = async () => {
    if (!subscription.statusValidUntil) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Please select a status valid until date.`),
      });
      return;
    }

    const nextBillingGroupId = selectedBillingGroup?.id ?? '';
    const shouldUpdateBillingGroup =
      nextBillingGroupId !== initialBillingGroupId;

    setSaving(true);
    try {
      if (shouldUpdateBillingGroup) {
        await updateBillingGroup.mutateAsync({
          pathParameters: {id: communityId},
          payload: {billingGroupId: nextBillingGroupId},
        });
      }

      const updatedSubscription = await updateSubscription.mutateAsync({
        pathParameters: {id: communityId},
        payload: {
          statusValidUntil: subscription.statusValidUntil,
          status: statusValue || undefined,
          subscriptionEnds: subscription.subscriptionEnds,
        },
      });

      // Server is source of truth: replace local state with server response
      setSubscription(
        updatedSubscription
          ? {
              ...updatedSubscription,
              history: updatedSubscription.history ?? [],
            }
          : {history: []},
      );
      setInitialBillingGroupId(nextBillingGroupId);
      await queryClient.invalidateQueries({queryKey: ['billingGroup']});

      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`Billing settings updated`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the billing settings`),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
      >
        <Form.Group className="mb-3" controlId="billingGroup">
          <Form.Label column sm="2">
            <Trans>Billing group</Trans>
          </Form.Label>
          <BillingGroupSelector
            selected={selectedBillingGroup}
            isDisabled={loading || saving}
            onSelect={(group) => {
              setSelectedBillingGroup(group);
              if (!group) return;
              setSubscription((previous) => {
                if (previous.statusValidUntil) return previous;
                if (!group.lastSubscriptionEnd) return previous;
                return {
                  ...previous,
                  statusValidUntil: group.lastSubscriptionEnd,
                };
              });
            }}
            onCreateGroup={openCreateGroupModal}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="statusValidUntil">
          <Form.Label column sm="2">
            <Trans>Status valid until</Trans>
          </Form.Label>

          <Form.Control
            required
            type="date"
            value={toInputDateValue(subscription.statusValidUntil)}
            disabled={loading || saving}
            onChange={(event) => {
              const localDate = new Date(event.target.value);
              localDate.setHours(23, 59, 59, 999);
              setSubscription({
                ...subscription,
                statusValidUntil: localDate.toISOString(),
              });
            }}
          />
          {loading ? null : updatedSummary ? (
            <Form.Text className="text-muted d-block mt-1">
              {updatedSummary}
            </Form.Text>
          ) : (
            <Form.Text className="text-muted d-block mt-1">
              <Trans>Not updated yet.</Trans>
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="subscriptionStatus">
          <Form.Label column sm="2">
            <Trans>Subscription status</Trans>
          </Form.Label>
          <Form.Select
            value={statusValue}
            disabled={loading || saving}
            onChange={(event) => {
              setSubscription({
                ...subscription,
                status: (event.target.value as SubscriptionStatus) || undefined,
              });
            }}
          >
            <option value="">{_(msg`Not set`)}</option>
            {subscriptionStatuses.map((value) => (
              <option key={value} value={value}>
                {statusLabels[value]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="subscriptionEnds">
          <Form.Check
            type="checkbox"
            label={_(msg`Subscription ends`)}
            checked={subscription.subscriptionEnds ?? false}
            disabled={loading || saving}
            onChange={(event) => {
              setSubscription({
                ...subscription,
                subscriptionEnds: event.target.checked,
              });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="subscriptionHistory">
          <Form.Label column sm="2">
            <Trans>Subscription history</Trans>
          </Form.Label>
          {historyEntries.length === 0 ? (
            <Form.Text className="text-muted d-block mt-1">
              <Trans>No changes yet.</Trans>
            </Form.Text>
          ) : (
            <div className="table-responsive">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>
                      <Trans>Status</Trans>
                    </th>
                    <th>
                      <Trans>Ends</Trans>
                    </th>
                    <th>
                      <Trans>Status valid until</Trans>
                    </th>
                    <th>
                      <Trans>Updated by</Trans>
                    </th>
                    <th>
                      <Trans>Updated at</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyEntries.map((entry) => {
                    const statusLabel = entry.status
                      ? statusLabels[entry.status]
                      : _(msg`Not set`);
                    const historyUpdatedBy = entry.updatedBy
                      ? `${entry.updatedBy.firstName} ${entry.updatedBy.lastName}`
                      : '';
                    const historyKey =
                      entry.updatedAt ??
                      entry.statusValidUntil ??
                      entry.status ??
                      historyUpdatedBy;

                    return (
                      <tr key={historyKey}>
                        <td>{statusLabel}</td>
                        <td>
                          {entry.subscriptionEnds ? _(msg`Yes`) : _(msg`No`)}
                        </td>
                        <td>{formatDate(entry.statusValidUntil) || '-'}</td>
                        <td>{historyUpdatedBy || '-'}</td>
                        <td>{formatDateTime(entry.updatedAt) || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="float-end"
          disabled={saving || loading}
        >
          {saving ? _(msg`Saving…`) : _(msg`Save`)}
        </Button>
      </Form>

      <Modal
        show={isBillingGroupDetailsOpen}
        size="lg"
        onHide={() => {
          setIsBillingGroupDetailsOpen(false);
          setBillingGroupDetails(undefined);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {billingGroupDetails
              ? billingGroupDetails.name
              : _(msg`Billing group`)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isBillingGroupDetailsLoading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span className="text-muted">
                <Trans>Loading billing group…</Trans>
              </span>
            </div>
          ) : billingGroupDetails ? (
            <BillingGroupDetails
              group={billingGroupDetails}
              isContactModalOpen={isContactModalOpen}
              onRefresh={async () => {
                const refreshed = await api.getBillingGroup({
                  id: billingGroupDetails.id,
                });
                setBillingGroupDetails(refreshed);
              }}
              onRemoved={() => {
                setBillingGroupDetails(undefined);
                setSelectedBillingGroup(undefined);
                setIsBillingGroupDetailsOpen(false);
                setInitialBillingGroupId('');
              }}
              onAddContact={(onCreated) => {
                setContactForm(emptyContactForm);
                setOnContactCreated(() => (contact: BillingContact) => {
                  onCreated(contact);
                });
                setIsContactModalOpen(true);
              }}
            />
          ) : (
            <div className="text-muted">
              <Trans>No billing group selected.</Trans>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={groupModalOpen} onHide={closeCreateGroupModal}>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void handleCreateGroupSubmit(event);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Trans>New billing group</Trans>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group controlId="groupName">
              <Form.Label>
                <Trans>Name</Trans>
              </Form.Label>
              <Form.Control
                required
                value={groupForm.name}
                onChange={(event) => {
                  setGroupForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group controlId="groupContact">
              <Form.Label>
                <Trans>Billing contact</Trans>
              </Form.Label>
              <BillingContactSelector
                selected={groupForm.billingContact}
                onSelect={(contact) => {
                  setGroupForm((previous) => ({
                    ...previous,
                    billingContactId: contact?.id ?? '',
                    billingContact: contact,
                  }));
                }}
                onCreateContact={(onCreated) => {
                  setContactForm(emptyContactForm);
                  setOnContactCreated(() => (contact: BillingContact) => {
                    onCreated(contact);
                  });
                  setIsContactModalOpen(true);
                }}
              />
            </Form.Group>
            <Form.Group controlId="groupNotes">
              <Form.Label>
                <Trans>Notes</Trans>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={groupForm.notes ?? ''}
                onChange={(event) => {
                  setGroupForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }));
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closeCreateGroupModal}>
              <Trans>Cancel</Trans>
            </Button>
            <Button type="submit" disabled={savingGroup}>
              {savingGroup ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  <Trans>Saving…</Trans>
                </>
              ) : (
                <Trans>Save group</Trans>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

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
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void handleContactSubmit(event);
        }}
      />
    </>
  );
}
