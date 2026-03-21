import {Button} from 'react-bootstrap';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useState} from 'react';
import api from '@/api/ApiClient';
import {type CreateCommunityInvitationResponse} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly communityId: string;
};

export default function Invitation(props: Props) {
  const {communityId} = props;
  const toasts = useToasts();
  const {_} = useLingui();
  const [invitation, setInvitation] =
    useState<CreateCommunityInvitationResponse>();

  const handleCreateInvite = async () => {
    try {
      const newInvitation = await api.createCommunityInvitation(
        {id: communityId},
        {},
      );
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
      {invitation && <p>{invitation.code}</p>}
    </div>
  );
}
