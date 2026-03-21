import {useEffect, useState} from 'react';
import {X} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import CommunityAdder from './CommunityAdder';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type GetUserCommunitiesResponse} from '@/api/ApiTypes';

type Props = {
  readonly userId: string;
};

export default function UserCoummunities(props: Props) {
  const {userId} = props;
  const [userCommunities, setUserCommunities] =
    useState<GetUserCommunitiesResponse>([]);
  const toasts = useToasts();

  useEffect(() => {
    const getuserCommunities = async () => {
      try {
        const communities = await api.getUserCommunities({id: userId});
        setUserCommunities(communities);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the communities',
        });
      }
    };

    void getuserCommunities();
  }, [userId, toasts]);

  const handleRoleChange = async (
    communityId: string,
    role: 'admin' | 'member',
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
        userCommunities.map((c) => (c._id === communityId ? {...c, role} : c)),
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

      setUserCommunities(userCommunities.filter((c) => c._id !== communityId));
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
        <Row key={community._id} className="mb-3">
          <Col xs={8}>{community.name}</Col>
          <Col xs={3}>
            <Form.Select
              value={community.role}
              size="sm"
              onChange={async (event) =>
                handleRoleChange(
                  community._id,
                  event.target.value as 'admin' | 'member',
                )
              }
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Col>
          <Col xs={1} className="float-right">
            <Button
              size="sm"
              onClick={async () => handleUserRemove(community._id)}
            >
              <X />
            </Button>
          </Col>
        </Row>
      ))}
      <hr />
      <CommunityAdder
        userId={userId}
        onCommunityAdd={(community) => {
          setUserCommunities([
            ...userCommunities.filter((c) => c._id !== community._id),
            community,
          ]);
        }}
      />
    </>
  );
}
