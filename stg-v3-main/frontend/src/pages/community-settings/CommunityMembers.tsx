import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useEffect, useState} from 'react';
import {useLingui} from '@lingui/react';
import {X} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import api from '@client/ApiClient';
import {type GetCommunityMembersResponse} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {confirm} from '@/components/ui/confirm.js';

type Properties = {
  readonly communityId: string;
};

export default function UserCoummunities(properties: Properties) {
  const {currentUser} = useCurrentUser();
  const {communityId} = properties;
  const [communityMembers, setCommunityMembers] =
    useState<GetCommunityMembersResponse>([]);
  const toasts = useToasts();
  const {_} = useLingui();

  useEffect(() => {
    const getuserCommunities = async () => {
      try {
        const members = await api.getCommunityMembers({id: communityId});
        setCommunityMembers(members);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(
            msg`Something went wrong while loading the community members`,
          ),
        });
      }
    };

    void getuserCommunities();
  }, [communityId, toasts, _]);

  const handleRoleChange = async (userId: string, role: 'admin' | 'member') => {
    try {
      await api.upsertCommunityMember(
        {
          id: communityId,
          userId,
        },
        {role},
      );

      setCommunityMembers(
        communityMembers.map((user) =>
          user.id === userId ? {...user, role} : user,
        ),
      );

      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`User role updated`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while updating the user role`),
      });
    }
  };

  const handleUserRemove = async (userId: string) => {
    try {
      const confirmed = await confirm({
        title: _(msg`Remove member`),
        text: _(
          msg`Are you sure you want to remove this user from the community. This can't be undone.`,
        ),
        confirm: _(msg`Yes, remove`),
        cancel: _(msg`No, cancel`),
      });

      if (!confirmed) {
        return;
      }

      await api.removeCommunityMember({
        id: communityId,
        userId,
      });

      setCommunityMembers(communityMembers.filter((c) => c.id !== userId));
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while removing the user`),
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  const {communities, selectedCommunity} = currentUser;
  const communityRole = communities.find(
    (community) => community.id === selectedCommunity,
  )?.role;

  return (
    <>
      {communityMembers.map((member) => (
        <Row key={member.id} className="mb-3">
          <Col xs={8}>
            {member.firstName} {member.lastName}
          </Col>
          <Col xs={3}>
            {member.role === 'owner' &&
            !currentUser.roles.includes('super-admin') ? (
              <Form.Control disabled defaultValue="Owner" size="sm" />
            ) : (
              <Form.Select
                value={member.role}
                size="sm"
                disabled={
                  communityRole !== 'owner' &&
                  !currentUser.roles.includes('super-admin')
                }
                onChange={async (event) =>
                  handleRoleChange(
                    member.id,
                    event.target.value as 'admin' | 'member',
                  )
                }
              >
                <option value="member">
                  <Trans>Member</Trans>
                </option>
                <option value="admin">
                  <Trans>Admin</Trans>
                </option>
                {currentUser.roles.includes('super-admin') && (
                  <option value="owner">
                    <Trans>Owner</Trans>
                  </option>
                )}
              </Form.Select>
            )}
          </Col>
          <Col xs={1} className="float-right">
            <Button
              disabled={member.role === 'owner'}
              variant="danger"
              size="sm"
              onClick={async () => handleUserRemove(member.id)}
            >
              <X />
            </Button>
          </Col>
        </Row>
      ))}
    </>
  );
}
