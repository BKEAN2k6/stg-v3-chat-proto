import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect} from 'react';
import {Button, Card, ButtonGroup} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {type Group} from '@client/ApiTypes.js';
import GroupModal from './GroupModal.js';
import GroupCardContent from './GroupCardContent.js';
import {Loader} from '@/components/ui/Loader.js';
import {
  useGetCommunityGroupsQuery,
  useCreateCommunityGroupMutation,
  useUpdateGroupMutation,
} from '@/hooks/useApi.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

export default function GroupsPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();

  const [groupFilter, setGroupFilter] = useState<'your' | 'all'>('your');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>(
    undefined,
  );

  const {
    data: communityGroups,
    isFetched,
    error: groupsError,
  } = useGetCommunityGroupsQuery(
    {id: currentUser?.selectedCommunity ?? ''},
    {
      enabled: Boolean(currentUser),
    },
  );

  const createMutation = useCreateCommunityGroupMutation();
  const updateMutation = useUpdateGroupMutation();

  useEffect(() => {
    if (groupsError ?? createMutation.error ?? updateMutation.error) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while processing the group.`),
      });
    }
  }, [groupsError, createMutation.error, updateMutation.error, toasts, _]);

  useEffect(() => {
    if (
      currentUser &&
      communityGroups &&
      communityGroups.length > 0 &&
      groupFilter === 'your' &&
      !communityGroups.some((group) => group.owner.id === currentUser.id)
    ) {
      setGroupFilter('all');
    }
  }, [communityGroups, currentUser, groupFilter]);

  if (!currentUser || !communityGroups) return null;

  const filteredGroups =
    groupFilter === 'your'
      ? communityGroups.filter((group) => group.owner.id === currentUser.id)
      : communityGroups;

  filteredGroups.sort((a, b) => a.name.localeCompare(b.name));

  const handleCreateGroup = async (
    name: string,
    description: string,
    owner: string,
  ): Promise<void> => {
    if (!currentUser) return;
    setShowGroupModal(false);
    const newGroup = await createMutation.mutateAsync({
      pathParameters: {id: currentUser.selectedCommunity},
      payload: {name, description, owner},
    });
    if (newGroup.owner.id !== currentUser.id) {
      setGroupFilter('all');
    }
  };

  const handleUpdateGroup = async (
    name: string,
    description: string,
    owner: string,
  ) => {
    if (!currentUser || !editingGroup) return;
    setShowGroupModal(false);
    await updateMutation.mutateAsync({
      pathParameters: {id: editingGroup.id},
      payload: {name, description, owner},
    });
    setEditingGroup(undefined);
  };

  const hasNonUserGroups = communityGroups.some(
    (group) => group.owner.id !== currentUser.id,
  );

  const noGroupsMessage = (
    <Card className="text-center mt-3" style={{backgroundColor: '#f9fafb'}}>
      <Card.Body>
        <h4>
          <Trans>No groups created</Trans>
        </h4>
        <p>
          <Trans>
            Create a group and start practicing your strength related skills
            together.
          </Trans>
        </p>
        <Button
          variant="primary"
          onClick={() => {
            setEditingGroup(undefined);
            setShowGroupModal(true);
          }}
        >
          <Trans>Create group</Trans>
        </Button>
      </Card.Body>
    </Card>
  );

  const pageWithGroups = (
    <>
      {!isFetched && <Loader />}

      <div className="card-container mt-3">
        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            style={{backgroundColor: '#f9fafb'}}
            className="card-w-100 card-w-md-50 card-w-lg-33"
          >
            <GroupCardContent
              key={group.id}
              group={group}
              onCardClick={() => {
                setEditingGroup(group);
                setShowGroupModal(true);
              }}
            />
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <>
      <PageTitle title={_(msg`Groups`)}>
        {filteredGroups.length > 0 && (
          <Button
            variant="outline-primary"
            onClick={() => {
              setEditingGroup(undefined);
              setShowGroupModal(true);
            }}
          >
            <Trans>Create group</Trans>
          </Button>
        )}
      </PageTitle>

      {hasNonUserGroups ? (
        <ButtonGroup className="mt-3">
          <Button
            variant={groupFilter === 'your' ? 'primary' : 'outline-primary'}
            onClick={() => {
              setGroupFilter('your');
            }}
          >
            <Trans>Your groups</Trans>
          </Button>
          <Button
            variant={groupFilter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => {
              setGroupFilter('all');
            }}
          >
            <Trans>All groups</Trans>
          </Button>
        </ButtonGroup>
      ) : null}

      {(communityGroups.length === 0 && isFetched) ||
      (filteredGroups.length === 0 && isFetched)
        ? noGroupsMessage
        : pageWithGroups}

      <GroupModal
        isShown={showGroupModal}
        communityId={currentUser.selectedCommunity}
        initialName={editingGroup ? editingGroup.name : ''}
        initialDescription={editingGroup ? editingGroup.description || '' : ''}
        initialOwnerId={editingGroup ? editingGroup.owner.id : currentUser.id}
        onHide={() => {
          setShowGroupModal(false);
          setEditingGroup(undefined);
        }}
        onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
      />
    </>
  );
}
