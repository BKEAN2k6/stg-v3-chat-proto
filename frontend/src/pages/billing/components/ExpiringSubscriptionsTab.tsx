import {useState, useMemo} from 'react';
import {Button, Stack, Table, Modal} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import type {Community} from '@client/ApiTypes';
import {
  useGetCommunitiesQuery,
  useUpdateCommunitySubscriptionMutation,
} from '@/hooks/useApi.js';
import {useToasts} from '@/components/toasts/index.js';
import CenteredLoader from '@/components/CenteredLoader.js';
import {confirm} from '@/components/ui/confirm.js';
import CommunitySubscription from '@/pages/community-settings/CommunitySubcription.js';

export function ExpiringSubscriptionsTab() {
  const [editingCommunityId, setEditingCommunityId] = useState<
    string | undefined
  >();
  const [endingCommunityId, setEndingCommunityId] = useState<string>();
  const toasts = useToasts();
  const updateSubscription = useUpdateCommunitySubscriptionMutation();

  const queryParameters = useMemo(
    () => ({
      status: 'active-manual' as const,
      statusValidUntilFrom: new Date().toISOString(),
      subscriptionEnds: 'false',
      sort: 'subscriptionStatusValidUntil',
      limit: '1000',
    }),
    [],
  );

  const {data: communities = [], isLoading} =
    useGetCommunitiesQuery(queryParameters);

  if (isLoading) {
    return <CenteredLoader />;
  }

  const handleEndSubscription = async (community: Community) => {
    const confirmed = await confirm({
      title: 'End subscription?',
      text: `This will mark ${community.name} to end on its current status valid until date.`,
      cancel: 'Cancel',
      confirm: 'End subscription',
      confirmVariant: 'danger',
    });
    if (!confirmed) return;

    const validUntil = community.subscriptionStatusValidUntil;
    if (!validUntil) {
      toasts.danger({
        header: 'Cannot end subscription',
        body: 'Add a status valid until date before ending the subscription.',
      });
      return;
    }

    setEndingCommunityId(community.id);
    try {
      await updateSubscription.mutateAsync({
        pathParameters: {id: community.id},
        payload: {
          statusValidUntil: validUntil,
          status: community.subscriptionStatus ?? undefined,
          subscriptionEnds: true,
        },
      });
      const formattedDate = new Date(validUntil).toLocaleDateString();
      toasts.success({
        header: 'Subscription ending',
        body: `${community.name} will end after ${formattedDate}.`,
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Failed to update the subscription.',
      });
    } finally {
      setEndingCommunityId(undefined);
    }
  };

  return (
    <Stack gap={3}>
      <p className="text-muted">
        <Trans>
          This list contains communities with active manual subscriptions that
          are not yet marked to end.
        </Trans>
      </p>
      {communities.length === 0 ? (
        <div className="text-center text-muted p-5">
          <Trans>No expiring subscriptions found.</Trans>
        </div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>
                <Trans>Name</Trans>
              </th>
              <th>
                <Trans>Ends at</Trans>
              </th>
              <th className="text-end">
                <Trans>Actions</Trans>
              </th>
            </tr>
          </thead>
          <tbody>
            {communities.map((community) => (
              <tr key={community.id}>
                <td className="align-middle">{community.name}</td>
                <td className="align-middle">
                  {community.subscriptionStatusValidUntil
                    ? new Date(
                        community.subscriptionStatusValidUntil,
                      ).toLocaleDateString()
                    : '-'}
                </td>
                <td className="text-end">
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="justify-content-end"
                  >
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditingCommunityId(community.id);
                      }}
                    >
                      <Trans>Update subscription</Trans>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={endingCommunityId === community.id}
                      onClick={() => {
                        void handleEndSubscription(community);
                      }}
                    >
                      {endingCommunityId === community.id ? (
                        <Trans>Ending...</Trans>
                      ) : (
                        <Trans>End subscription</Trans>
                      )}
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {editingCommunityId ? (
        <Modal
          centered
          show
          size="lg"
          onHide={() => {
            setEditingCommunityId(undefined);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Trans>Manage Subscription</Trans>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CommunitySubscription communityId={editingCommunityId} />
          </Modal.Body>
        </Modal>
      ) : null}
    </Stack>
  );
}
