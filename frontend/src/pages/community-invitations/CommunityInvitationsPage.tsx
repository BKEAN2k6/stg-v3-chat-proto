import {Trans} from '@lingui/react/macro';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {useEffect, useState} from 'react';
import {Button, Row, Col, Alert, Container} from 'react-bootstrap';
import {type GetMyCommunityInvitationsResponse} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function InvitationsPage() {
  const [invitations, setInvitations] =
    useState<GetMyCommunityInvitationsResponse>([]);
  const toasts = useToasts();
  const {setCurrentUser} = useCurrentUser();
  const {_} = useLingui();

  useEffect(() => {
    const getInvitations = async () => {
      try {
        const invitations = await api.getMyCommunityInvitations();
        setInvitations(invitations);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the invitations',
        });
      }
    };

    void getInvitations();
  }, [toasts]);

  const removeInvitation = async (id: string) => {
    try {
      await api.removeCommunityMemberInvitation({id});
      setInvitations((previous) =>
        previous.filter((invitation) => invitation.id !== id),
      );
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while removing the invitation',
      });
    }
  };

  const acceptInvitation = async (id: string) => {
    try {
      await api.updateMyCommunityInvitation({id}, {status: 'accepted'});
      setInvitations((previous) =>
        previous.filter((invitation) => invitation.id !== id),
      );
      const user = await api.getMe();
      setCurrentUser(user);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while accepting the invitation',
      });
    }
  };

  if (!invitations) {
    return null;
  }

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title={_(msg`Community Invitations`)} />

      {invitations.length === 0 ? (
        <Alert variant="info">
          <Trans>You have no pending invitations.</Trans>
        </Alert>
      ) : (
        <Container>
          {invitations.map((invitation) => (
            <Row key={invitation.id} className="align-items-center mb-3">
              <Col>
                <h5 className="mb-0">{invitation.community.name}</h5>
                <p className="mb-0 text-muted">
                  {invitation.message ||
                    'You are invited to join this community.'}
                </p>
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={async () => acceptInvitation(invitation.id)}
                >
                  <Trans>Accept</Trans>
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => removeInvitation(invitation.id)}
                >
                  <Trans>Decline</Trans>
                </Button>
              </Col>
            </Row>
          ))}
        </Container>
      )}
    </div>
  );
}
