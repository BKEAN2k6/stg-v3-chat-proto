import {useEffect, useState} from 'react';
import {useLingui} from '@lingui/react';
import {Trans, msg} from '@lingui/macro';
import {X} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type GetCommunityMembersResponse} from '@/api/ApiTypes';

type Props = {
  readonly communityId: string;
};

export default function UserCoummunities(props: Props) {
  const {communityId} = props;
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
          user._id === userId ? {...user, role} : user,
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
      await api.removeCommunityMember({
        id: communityId,
        userId,
      });

      setCommunityMembers(communityMembers.filter((c) => c._id !== userId));
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while removing the user`),
      });
    }
  };

  return (
    <>
      {communityMembers.map((member) => (
        <Row key={member._id} className="mb-3">
          <Col xs={8}>
            {member.firstName} {member.lastName}
          </Col>
          <Col xs={3}>
            <Form.Select
              value={member.role}
              size="sm"
              onChange={async (event) =>
                handleRoleChange(
                  member._id,
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
            </Form.Select>
          </Col>
          <Col xs={1} className="float-right">
            <Button
              size="sm"
              onClick={async () => handleUserRemove(member._id)}
            >
              <X />
            </Button>
          </Col>
        </Row>
      ))}
    </>
  );
}
