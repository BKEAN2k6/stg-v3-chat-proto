import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useEffect, useState} from 'react';
import {useLingui} from '@lingui/react';
import {X} from 'react-bootstrap-icons';
import {Alert, Button, Row, Col, Form} from 'react-bootstrap';
import api from '@client/ApiClient';
import {
  type GetCommunityMemberInvitationsResponse,
  type GetCommunityMembersResponse,
} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {confirm} from '@/components/ui/confirm.js';

type Properties = {
  readonly communityId: string;
};

export default function CommunityMemberInvitations(properties: Properties) {
  const {currentUser} = useCurrentUser();
  const {communityId} = properties;
  const [communityMemberInvitations, setCommunityMemberInvitations] =
    useState<GetCommunityMemberInvitationsResponse>([]);
  const [communityMembers, setCommunityMembers] =
    useState<GetCommunityMembersResponse>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const toasts = useToasts();
  const {_} = useLingui();

  useEffect(() => {
    const getCommunityMemberInvitations = async () => {
      try {
        const [invitations, members] = await Promise.all([
          api.getCommunityMemberInvitations({id: communityId}),
          api.getCommunityMembers({id: communityId}),
        ]);
        setCommunityMembers(members);
        setCommunityMemberInvitations(invitations);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while loading the invitations`),
        });
      }
    };

    void getCommunityMemberInvitations();
  }, [communityId, toasts, _]);

  const handleInvitationCreate = async () => {
    if (communityMembers.some((member) => member.email === email)) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`This user is already a member of the community`),
      });
      return;
    }

    if (
      communityMemberInvitations.some(
        (invitation) => invitation.email === email,
      )
    ) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`This user already has a pending invitation`),
      });
      return;
    }

    try {
      const {exists} = await api.checkEmailExists({email});
      if (!exists) {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`This email address is not registered in the system`),
        });
        return;
      }

      const invitation = await api.createCommunityMemberInvitation(
        {id: communityId},
        {email, message},
      );
      setCommunityMemberInvitations([
        ...communityMemberInvitations,
        invitation,
      ]);
      setEmail('');
      setMessage('');
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while sending the invitation`),
      });
    }
  };

  const handleInvitationRemove = async (id: string) => {
    try {
      const confirmed = await confirm({
        title: _(msg`Remove member`),
        text: _(
          msg`Are you sure you want to remove this invitation from the community? This can't be undone.`,
        ),
        confirm: _(msg`Yes, remove`),
        cancel: _(msg`No, cancel`),
      });

      if (!confirmed) {
        return;
      }

      await api.removeCommunityMemberInvitation({id});
      setCommunityMemberInvitations(
        communityMemberInvitations.filter((invitation) => invitation.id !== id),
      );
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while removing the invitation`),
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Alert variant="info">
        <Trans>
          At the moment, you can only invite users that are already registered
          to the service.
        </Trans>
      </Alert>
      <Form.Control
        className="mb-3"
        type="email"
        placeholder={_(msg`Enter email`)}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />

      <Form.Control
        className="mb-3"
        maxLength={500}
        placeholder={_(msg`Add an optional welcome message`)}
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />

      <Button onClick={handleInvitationCreate}>
        <Trans>Send Invitation</Trans>
      </Button>

      <hr />
      <Row>
        <Col>
          <h6>
            <Trans>Pending Invitations</Trans>
          </h6>
          <ul className="list-group">
            {communityMemberInvitations.map((invitation) => (
              <li
                key={invitation.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{invitation.email}</strong>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={async () => handleInvitationRemove(invitation.id)}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </div>
  );
}
