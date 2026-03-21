import {useCallback, useEffect, useState} from 'react';
import {X} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import api from '@client/ApiClient';
import {type GetUserCommunitiesResponse} from '@client/ApiTypes';
import CommunityAdder from './CommunityAdder.js';
import {useToasts} from '@/components/toasts/index.js';
import CommunitySettings from '@/pages/community-settings/CommunitySettings.js';
import {useGetCommunityQuery} from '@/hooks/useApi.js';

type Properties = {
  readonly userId: string;
};

export default function UserCoummunities(properties: Properties) {
  const {userId} = properties;
  const [userCommunities, setUserCommunities] =
    useState<GetUserCommunitiesResponse>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>();
  const toasts = useToasts();
  const loadUserCommunities = useCallback(async () => {
    try {
      const communities = await api.getUserCommunities({id: userId});
      setUserCommunities(communities);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while loading the communities',
      });
    }
  }, [userId, toasts]);
  const {data: selectedCommunity} = useGetCommunityQuery(
    {id: selectedCommunityId ?? ''},
    {enabled: Boolean(selectedCommunityId)},
  );

  useEffect(() => {
    void loadUserCommunities();
  }, [loadUserCommunities]);

  const handleRoleChange = async (
    communityId: string,
    role: 'admin' | 'member' | 'owner',
  ) => {
    try {
      await api.upsertCommunityMember(
        {
          id: communityId,
          userId,
        },
        {role},
      );

      setUserCommunities(
        userCommunities.map((c) => (c.id === communityId ? {...c, role} : c)),
      );
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while updating the user role',
      });
    }
  };

  const handleUserRemove = async (communityId: string) => {
    try {
      await api.removeCommunityMember({
        id: communityId,
        userId,
      });

      setUserCommunities(userCommunities.filter((c) => c.id !== communityId));
      setSelectedCommunityId((currentCommunityId) =>
        currentCommunityId === communityId ? undefined : currentCommunityId,
      );
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while removing the user',
      });
    }
  };

  return (
    <>
      {userCommunities.map((community) => (
        <Row key={community.id} className="mb-3">
          <Col xs={8}>
            <Button
              variant="link"
              className="p-0 text-start"
              onClick={() => {
                setSelectedCommunityId(community.id);
              }}
            >
              {community.name}
            </Button>
          </Col>
          <Col xs={3}>
            <Form.Select
              value={community.role}
              size="sm"
              onChange={async (event) =>
                handleRoleChange(
                  community.id,
                  event.target.value as 'admin' | 'member' | 'owner',
                )
              }
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </Form.Select>
          </Col>
          <Col xs={1} className="float-right">
            <Button
              size="sm"
              onClick={async () => handleUserRemove(community.id)}
            >
              <X />
            </Button>
          </Col>
        </Row>
      ))}
      <Modal
        scrollable
        show={selectedCommunity !== undefined}
        size="xl"
        onHide={() => {
          setSelectedCommunityId(undefined);
          void loadUserCommunities();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedCommunity?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCommunity ? (
            <CommunitySettings
              communityId={selectedCommunity.id}
              initialCommunity={selectedCommunity}
              isPageTitleUpdateEnabled={false}
            />
          ) : null}
        </Modal.Body>
      </Modal>
      <hr />
      <CommunityAdder
        userId={userId}
        onCommunityAdd={(community) => {
          setUserCommunities([
            ...userCommunities.filter((c) => c.id !== community.id),
            community,
          ]);
        }}
      />
    </>
  );
}
