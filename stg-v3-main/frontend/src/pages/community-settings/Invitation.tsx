import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useState} from 'react';
import api from '@client/ApiClient';
import {type CreateCommunityInvitationResponse} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';

type Properties = {
  readonly communityId: string;
};

export default function Invitation(properties: Properties) {
  const {communityId} = properties;
  const toasts = useToasts();
  const {_} = useLingui();
  const [invitation, setInvitation] =
    useState<CreateCommunityInvitationResponse>();

  const handleCreateInvite = async () => {
    try {
      const newInvitation = await api.createCommunityInvitation({
        id: communityId,
      });
      setInvitation(newInvitation);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating the invitation`),
      });
    }
  };

  return (
    <div>
      <h1>
        <Trans>Invite people</Trans>
      </h1>
      <Button onClick={handleCreateInvite}>
        <Trans>Create Invitation</Trans>
      </Button>
      {invitation?.code ? (
        <p>
          {invitation.code.length === 6
            ? `${invitation.code.slice(0, 3)}-${invitation.code.slice(3)}`
            : invitation.code}
        </p>
      ) : null}
    </div>
  );
}
