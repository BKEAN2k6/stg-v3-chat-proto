import {useState} from 'react';
import {Card, Spinner, Stack, Table} from 'react-bootstrap';
import {
  type BillingContact,
  type BillingGroup,
  type CreateBillingGroupRequest,
} from '@client/ApiTypes';
import {
  useCreateBillingGroupMutation,
  useGetBillingGroupQuery,
} from '@client/ApiHooks.js';
import {BillingGroupDetails} from './BillingGroupDetails.js';
import {BillingGroupSelector} from './BillingGroupSelector.js';
import {
  BillingGroupModal,
  emptyGroupForm,
  type BillingGroupFormState,
} from './BillingGroupModal.js';
import {normalizeOptionalText} from './billingUtils.js';
import CreateCommunityModal from './CreateCommunityModal.js';
import {useToasts} from '@/components/toasts/index.js';

type BillingGroupsTabProperties = {
  readonly contacts: BillingContact[];
  readonly recentGroups: BillingGroup[];
  readonly isRecentGroupsLoading: boolean;
  readonly isContactModalOpen: boolean;
  readonly onReloadGroups: () => Promise<void>;
  readonly onAddContact: (onCreated: (contact: BillingContact) => void) => void;
  readonly selectedGroupId: string | undefined;
  readonly onSelectGroup: (id: string | undefined) => void;
};

export function BillingGroupsTab({
  contacts,
  recentGroups,
  isRecentGroupsLoading,
  isContactModalOpen,
  onReloadGroups,
  onAddContact,
  selectedGroupId,
  onSelectGroup,
}: BillingGroupsTabProperties) {
  const toasts = useToasts();
  const {
    data: selectedGroupData,
    isFetching: isSelectedGroupLoading,
    refetch: refetchSelectedGroup,
  } = useGetBillingGroupQuery(
    {id: selectedGroupId ?? ''},
    {enabled: Boolean(selectedGroupId)},
  );
  const selectedGroup = selectedGroupId ? selectedGroupData : undefined;
  const createBillingGroup = useCreateBillingGroupMutation();
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] =
    useState<BillingGroupFormState>(emptyGroupForm);
  const [savingGroup, setSavingGroup] = useState(false);
  const [createCommunityModalOpen, setCreateCommunityModalOpen] =
    useState(false);

  const openCreateGroupModal = () => {
    setGroupForm(emptyGroupForm);
    setGroupModalOpen(true);
  };

  const closeGroupModal = () => {
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
      const payload: CreateBillingGroupRequest = {
        name: data.name,
        billingContactId: data.billingContactId,
        notes: normalizeOptionalText(data.notes),
      };
      const created = await createBillingGroup.mutateAsync({payload});
      await onReloadGroups();

      // Select the newly created group
      onSelectGroup(created.id);

      closeGroupModal();

      toasts.success({
        header: 'Billing group created',
        body: `${created.name} has been added.`,
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

  return (
    <Stack gap={3}>
      <BillingGroupSelector
        selected={selectedGroup}
        isCreateDisabled={contacts.length === 0}
        createDisabledReason={
          contacts.length === 0
            ? 'Create at least one billing contact first'
            : undefined
        }
        onSelect={(group) => {
          onSelectGroup(group?.id ?? undefined);
        }}
        onCreateGroup={openCreateGroupModal}
      />

      {!selectedGroupId && (
        <Card>
          <Card.Header>
            <span className="fw-semibold">Recently updated billing groups</span>
          </Card.Header>
          <Card.Body>
            {isRecentGroupsLoading ? (
              <Stack
                direction="horizontal"
                gap={2}
                className="align-items-center text-muted"
              >
                <Spinner animation="border" size="sm" />
                Loading recent groups…
              </Stack>
            ) : recentGroups.length === 0 ? (
              <div className="text-muted">
                Recent billing group changes will appear here.
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover responsive size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Billing contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentGroups.map((group) => (
                      <tr
                        key={group.id}
                        role="button"
                        tabIndex={0}
                        className={[
                          'cursor-pointer',
                          group.id === selectedGroupId ? 'table-active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => {
                          onSelectGroup(group.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onSelectGroup(group.id);
                          }
                        }}
                      >
                        <td className="align-middle">{group.name}</td>
                        <td className="align-middle">
                          {group.billingContact.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {selectedGroupId && isSelectedGroupLoading && !selectedGroup ? (
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-center text-muted"
        >
          <Spinner animation="border" size="sm" />
          Loading billing group…
        </Stack>
      ) : null}

      {selectedGroup ? (
        <BillingGroupDetails
          group={selectedGroup}
          isContactModalOpen={isContactModalOpen}
          onRemoved={() => {
            void onReloadGroups();
            onSelectGroup(undefined);
          }}
          onAddContact={onAddContact}
          onCreateCommunity={() => {
            setCreateCommunityModalOpen(true);
          }}
        />
      ) : null}

      <BillingGroupModal
        isOpen={groupModalOpen ? !isContactModalOpen : false}
        isSaving={savingGroup}
        form={groupForm}
        setForm={setGroupForm}
        onHide={closeGroupModal}
        onSubmit={handleGroupSubmit}
        onAddContact={onAddContact}
      />

      <CreateCommunityModal
        key={selectedGroup?.id}
        isOpen={createCommunityModalOpen}
        handleClose={() => {
          setCreateCommunityModalOpen(false);
        }}
        initialBillingGroup={selectedGroup}
        onCommunityCreate={async () => {
          if (selectedGroupId) {
            await refetchSelectedGroup();
          }

          await onReloadGroups();
        }}
      />
    </Stack>
  );
}
