import {useEffect, useId, useMemo, useRef, useState} from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
  Table,
} from 'react-bootstrap';
import {
  AsyncTypeahead,
  type RenderMenuItemChildren,
  type TypeaheadRef,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import {useQueryClient} from '@tanstack/react-query';
import {
  type BillingContact,
  type BillingGroup,
  type BillingGroupCommunity,
  type GetCommunitiesResponse,
  type SubscriptionStatus,
  type UpdateBillingGroupRequest,
} from '@client/ApiTypes';
import {
  useGetCommunitiesQuery,
  useRemoveBillingGroupMutation,
  useUpdateBillingGroupMutation,
  useUpdateBillingGroupSubscriptionMutation,
  useUpdateCommunityBillingGroupMutation,
} from '@client/ApiHooks.js';
import {
  BillingGroupModal,
  emptyGroupForm,
  type BillingGroupFormState,
} from './BillingGroupModal.js';
import {
  formatSubscriptionStatus,
  normalizeOptionalText,
  subscriptionStatusLabels,
  subscriptionStatuses,
} from './billingUtils.js';
import {useToasts} from '@/components/toasts/index.js';
import {confirm} from '@/components/ui/confirm.js';
import CommunitySettings from '@/pages/community-settings/CommunitySettings.js';

const minimumCommunitySearchLength = 2;

type TypeaheadOption = Parameters<RenderMenuItemChildren>[0];

const isCommunityOption = (
  option: TypeaheadOption,
): option is GetCommunitiesResponse[number] =>
  typeof option === 'object' &&
  option !== null &&
  'id' in option &&
  'name' in option &&
  'timezone' in option;

const renderCommunityMenuItemChildren: RenderMenuItemChildren = (option) => {
  if (!isCommunityOption(option)) {
    const fallbackLabel =
      typeof option === 'string'
        ? option
        : typeof option === 'object' && option !== null && 'name' in option
          ? String(option.name)
          : 'Community';
    return <span>{fallbackLabel}</span>;
  }

  return (
    <div>
      <span>{option.name}</span>
      <small className="text-muted">{option.timezone}</small>
    </div>
  );
};

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

type BillingGroupDetailsProperties = {
  readonly group: BillingGroup;
  readonly isContactModalOpen: boolean;
  readonly onRefresh?: () => Promise<void>;
  readonly onRemoved?: () => void;
  readonly onAddContact?: (
    onCreated: (contact: BillingContact) => void,
  ) => void;
  readonly onCreateCommunity?: () => void;
};

export function BillingGroupDetails({
  group,
  isContactModalOpen,
  onRefresh,
  onRemoved,
  onAddContact,
  onCreateCommunity,
}: BillingGroupDetailsProperties) {
  const toasts = useToasts();
  const [subscriptionDate, setSubscriptionDate] = useState(() =>
    toInputDateValue(group.lastSubscriptionEnd),
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    SubscriptionStatus | ''
  >('');
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [pendingCommunityId, setPendingCommunityId] = useState<string>();
  const [communitySearchTerm, setCommunitySearchTerm] = useState('');
  const communitySearchReference = useRef<TypeaheadRef>(null);
  const communitySearchId = useId();
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] =
    useState<BillingGroupFormState>(emptyGroupForm);
  const [savingGroup, setSavingGroup] = useState(false);
  const [communityModalCommunity, setCommunityModalCommunity] =
    useState<BillingGroupCommunity>();
  const statusLabels = subscriptionStatusLabels;
  const queryClient = useQueryClient();
  const updateCommunityBillingGroup = useUpdateCommunityBillingGroupMutation();
  const trimmedCommunitySearch = communitySearchTerm.trim();
  const isCommunitySearchEnabled =
    trimmedCommunitySearch.length >= minimumCommunitySearchLength;

  const communitySearchQuery = useGetCommunitiesQuery(
    isCommunitySearchEnabled
      ? {search: trimmedCommunitySearch, limit: '25'}
      : undefined,
    {enabled: isCommunitySearchEnabled},
  );
  const communitySearchData = useMemo(
    () =>
      isCommunitySearchEnabled && communitySearchQuery.data
        ? communitySearchQuery.data
        : [],
    [communitySearchQuery.data, isCommunitySearchEnabled],
  );
  const isCommunityQueryLoading = communitySearchQuery.isFetching;
  const existingCommunityIds = useMemo(
    () => new Set(group.communities.map((community) => community.id)),
    [group.communities],
  );
  const availableCommunitySearchResults = useMemo(
    () =>
      communitySearchData.filter(
        (community) => !existingCommunityIds.has(community.id),
      ),
    [communitySearchData, existingCommunityIds],
  );
  const invalidateBillingGroups = async () =>
    queryClient.invalidateQueries({
      queryKey: ['billingGroup'],
    });

  const updateBillingGroup = useUpdateBillingGroupMutation({
    async onSuccess() {
      await invalidateBillingGroups();
    },
  });
  const updateBillingGroupSubscription =
    useUpdateBillingGroupSubscriptionMutation({
      async onSuccess() {
        await invalidateBillingGroups();
      },
    });
  const removeBillingGroup = useRemoveBillingGroupMutation({
    async onSuccess() {
      await invalidateBillingGroups();
    },
  });

  useEffect(() => {
    setSubscriptionDate(toInputDateValue(group.lastSubscriptionEnd));
  }, [group.lastSubscriptionEnd]);

  const handleSubscriptionUpdate = async () => {
    if (!group || !subscriptionDate) {
      toasts.danger({
        header: 'Missing information',
        body: 'Select a billing group and pick a new status valid until date.',
      });
      return;
    }

    const endDate = new Date(subscriptionDate);
    if (Number.isNaN(endDate.getTime())) {
      toasts.danger({
        header: 'Invalid date',
        body: 'Please provide a valid date and time.',
      });
      return;
    }

    setIsUpdatingSubscription(true);

    try {
      const communitiesToUpdate = group.communities.filter((community) => {
        const isCommunitySelected = selectedCommunities.includes(community.id);
        const shouldUpdate =
          (community.subscriptionStatusValidUntil ?? '') !==
            endDate.toISOString() ||
          (subscriptionStatus &&
            community.subscriptionStatus !== subscriptionStatus);
        return isCommunitySelected && shouldUpdate;
      });
      setPendingCommunityId(communitiesToUpdate[0]?.id);
      const {billingGroup} = await updateBillingGroupSubscription.mutateAsync({
        pathParameters: {id: group.id},
        payload: {
          statusValidUntil: endDate.toISOString(),
          status: subscriptionStatus || undefined,
          communityIds: communitiesToUpdate.map((community) => community.id),
        },
      });
      setSelectedCommunities([]);
      setSubscriptionStatus('');
      setSubscriptionDate(toInputDateValue(billingGroup.lastSubscriptionEnd));
      await onRefresh?.();

      toasts.success({
        header: 'Subscription updated',
        body: 'All selected communities now share the same status valid until date.',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Failed to update the subscriptions.',
      });
    } finally {
      setIsUpdatingSubscription(false);
      setPendingCommunityId(undefined);
    }
  };

  const toggleCommunitySelection = (communityId: string) => {
    setSelectedCommunities((previous) =>
      previous.includes(communityId)
        ? previous.filter((id) => id !== communityId)
        : [...previous, communityId],
    );
  };

  const selectAllCommunities = () => {
    setSelectedCommunities(group.communities.map((community) => community.id));
  };

  const clearCommunitySelection = () => {
    setSelectedCommunities([]);
  };

  const handleCommunitySearchInput = (value: string) => {
    setCommunitySearchTerm(value);
  };

  const addCommunity = async (communityId: string) => {
    setPendingCommunityId(communityId);
    try {
      await updateCommunityBillingGroup.mutateAsync({
        pathParameters: {id: communityId},
        payload: {billingGroupId: group.id},
      });
      await onRefresh?.();
      setCommunitySearchTerm('');
      communitySearchReference.current?.clear();
      toasts.success({
        header: 'Community added',
        body: 'Community added to billing group.',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Failed to add community to billing group.',
      });
    } finally {
      setPendingCommunityId(undefined);
    }
  };

  const removeCommunity = async (community: BillingGroupCommunity) => {
    const confirmed = await confirm({
      title: 'Remove the community?',
      text: `This will remove ${community.name} from ${group.name}. Continue?`,
      cancel: 'Cancel',
      confirm: 'Remove',
      confirmVariant: 'danger',
    });
    if (!confirmed) return;

    setPendingCommunityId(community.id);
    try {
      await updateCommunityBillingGroup.mutateAsync({
        pathParameters: {id: community.id},
        // Backend requires the field to be present; null clears the billing group.
        payload: {billingGroupId: null as unknown as string},
      });
      setSelectedCommunities((previous) =>
        previous.filter((id) => id !== community.id),
      );
      await onRefresh?.();
      toasts.success({
        header: 'Community removed',
        body: `${community.name} was removed from ${group.name}.`,
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Failed to remove community.',
      });
    } finally {
      setPendingCommunityId(undefined);
    }
  };

  const openEditGroupModal = () => {
    setGroupForm({
      name: group.name,
      billingContactId: group.billingContact.id,
      billingContact: group.billingContact,
      notes: group.notes ?? '',
    });
    setGroupModalOpen(true);
  };

  const closeEditGroupModal = () => {
    setGroupModalOpen(false);
    setGroupForm(emptyGroupForm);
  };

  const handleGroupSubmit = async (data: BillingGroupFormState) => {
    if (!data.name || !data.billingContactId) {
      toasts.danger({
        header: 'Missing information',
        body: 'Please provide a name and billing contact for the group.',
      });
      return;
    }

    setSavingGroup(true);
    try {
      const payload: UpdateBillingGroupRequest = {
        name: data.name,
        billingContactId: data.billingContactId,
        notes: normalizeOptionalText(data.notes),
      };
      await updateBillingGroup.mutateAsync({
        pathParameters: {id: group.id},
        payload,
      });
      await onRefresh?.();
      closeEditGroupModal();
      toasts.success({
        header: 'Billing group updated',
        body: `${data.name} has been updated.`,
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Saving the billing group failed.',
      });
    } finally {
      setSavingGroup(false);
    }
  };

  const handleRemoveBillingGroup = async () => {
    const confirmed = await confirm({
      title: 'Remove billing group?',
      text: `This will permanently delete ${group.name}. Continue?`,
      cancel: 'Cancel',
      confirm: 'Remove',
      confirmVariant: 'danger',
    });
    if (!confirmed) return;

    try {
      await removeBillingGroup.mutateAsync({pathParameters: {id: group.id}});
      toasts.success({
        header: 'Billing group removed',
        body: `${group.name} was removed.`,
      });
      onRemoved?.();
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Failed to remove billing group.',
      });
    }
  };

  return (
    <Stack gap={3}>
      <Card>
        <Card.Header>
          <Stack
            direction="horizontal"
            className="justify-content-between align-items-center"
            gap={2}
          >
            <span className="fw-semibold">{group.name}</span>
            <Stack direction="horizontal" gap={2}>
              <Button size="sm" onClick={openEditGroupModal}>
                Edit group
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                disabled={group.communities.length > 0}
                title={
                  group.communities.length > 0
                    ? 'Remove all communities before deleting this billing group'
                    : undefined
                }
                onClick={handleRemoveBillingGroup}
              >
                Remove group
              </Button>
            </Stack>
          </Stack>
        </Card.Header>
        <Card.Body>
          <Row className="gy-3">
            <Col md={6}>
              <div className="fw-semibold mb-1">Contact details</div>
              <div>{group.billingContact.email}</div>
              {group.billingContact.crmLink ? (
                <div>
                  <a
                    href={group.billingContact.crmLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    CRM link
                  </a>
                </div>
              ) : null}
            </Col>
            <Col md={6}>
              <div className="fw-semibold mb-1">Notes</div>
              {group.notes ? (
                <div>{group.notes}</div>
              ) : (
                <div className="text-muted">No notes yet.</div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Stack
            direction="horizontal"
            className="justify-content-between align-items-center"
            gap={2}
          >
            <span className="fw-semibold">Communities</span>
          </Stack>
        </Card.Header>
        <Card.Body>
          <Stack gap={3}>
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubscriptionUpdate();
              }}
            >
              <Row className="align-items-end gy-3">
                <Col md={3}>
                  <Form.Group controlId="statusValidUntil">
                    <Form.Control
                      type="date"
                      value={subscriptionDate}
                      onChange={(event) => {
                        setSubscriptionDate(event.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="subscriptionStatus">
                    <Form.Select
                      value={subscriptionStatus}
                      onChange={(event) => {
                        setSubscriptionStatus(
                          (event.target.value as SubscriptionStatus) || '',
                        );
                      }}
                    >
                      <option value="">Keep existing status</option>
                      {subscriptionStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="justify-content-end"
                  >
                    <Button
                      variant="outline-secondary"
                      onClick={selectAllCommunities}
                    >
                      Select all
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={clearCommunitySelection}
                    >
                      Clear selection
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdatingSubscription || !subscriptionDate}
                    >
                      {isUpdatingSubscription
                        ? 'Updating…'
                        : 'Update subscriptions'}
                    </Button>
                  </Stack>
                </Col>
              </Row>
            </Form>
            <div className="table-responsive">
              <Table hover responsive size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th />
                    <th>Community</th>
                    <th>Status valid until</th>
                    <th>Status</th>
                    <th>Updated by</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.communities.map((community) => {
                    const statusValidUntil =
                      community.subscriptionStatusValidUntil
                        ? new Date(
                            community.subscriptionStatusValidUntil,
                          ).toLocaleDateString()
                        : 'Not set';
                    const subscriptionStatusLabel = formatSubscriptionStatus(
                      community.subscriptionStatus,
                    );
                    const updatedAt = formatDateTime(
                      community.subscriptionUpdatedAt,
                    );
                    const updatedByName = community.subscriptionUpdatedBy
                      ? `${community.subscriptionUpdatedBy.firstName} ${community.subscriptionUpdatedBy.lastName}`
                      : '';
                    const isSelected = selectedCommunities.includes(
                      community.id,
                    );
                    const isPending = pendingCommunityId === community.id;
                    return (
                      <tr
                        key={community.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                        onClick={() => {
                          setCommunityModalCommunity(community);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setCommunityModalCommunity(community);
                          }
                        }}
                      >
                        <td className="align-middle">
                          <Form.Check
                            type="checkbox"
                            checked={isSelected}
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            onChange={() => {
                              toggleCommunitySelection(community.id);
                            }}
                          />
                        </td>
                        <td className="align-middle">{community.name}</td>
                        <td className="align-middle">{statusValidUntil}</td>
                        <td className="align-middle">
                          {subscriptionStatusLabel}
                        </td>
                        <td className="align-middle">
                          {updatedByName ? (
                            <div className="d-flex flex-column">
                              <span className="fw-semibold">
                                {updatedByName}
                              </span>
                              {updatedAt ? (
                                <small className="text-muted">
                                  {updatedAt}
                                </small>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-muted">Not updated</span>
                          )}
                        </td>
                        <td className="text-end">
                          <Stack
                            direction="horizontal"
                            gap={2}
                            className="justify-content-end"
                          >
                            <Button
                              variant="outline-danger"
                              size="sm"
                              disabled={isPending}
                              onClick={(event) => {
                                event.stopPropagation();
                                void removeCommunity(community);
                              }}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <Stack
              direction="horizontal"
              gap={2}
              className="align-items-stretch"
            >
              <div className="flex-grow-1">
                <AsyncTypeahead
                  ref={communitySearchReference}
                  dropup
                  id={communitySearchId}
                  filterBy={() => true}
                  labelKey="name"
                  minLength={minimumCommunitySearchLength}
                  options={availableCommunitySearchResults}
                  placeholder="Search communities to add"
                  isLoading={isCommunityQueryLoading}
                  renderMenuItemChildren={renderCommunityMenuItemChildren}
                  onInputChange={handleCommunitySearchInput}
                  onSearch={() => undefined}
                  onChange={(selected) => {
                    const option = selected[0];
                    if (isCommunityOption(option)) {
                      void addCommunity(option.id);
                    }
                  }}
                />
              </div>
              {onCreateCommunity ? (
                <Button size="sm" onClick={onCreateCommunity}>
                  Create community
                </Button>
              ) : null}
            </Stack>
            <Modal
              scrollable
              show={Boolean(communityModalCommunity)}
              size="xl"
              onHide={() => {
                setCommunityModalCommunity(undefined);
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {communityModalCommunity?.name ?? 'Community settings'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {communityModalCommunity ? (
                  <CommunitySettings
                    communityId={communityModalCommunity.id}
                    isPageTitleUpdateEnabled={false}
                  />
                ) : null}
              </Modal.Body>
            </Modal>
          </Stack>
        </Card.Body>
      </Card>

      <BillingGroupModal
        isOpen={groupModalOpen ? !isContactModalOpen : false}
        isSaving={savingGroup}
        form={groupForm}
        setForm={setGroupForm}
        onHide={closeEditGroupModal}
        onSubmit={handleGroupSubmit}
        onAddContact={onAddContact}
      />
    </Stack>
  );
}
