import {useEffect, useState} from 'react';
import {useLingui} from '@lingui/react';
import {Trans, msg} from '@lingui/macro';
import {useParams} from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CommunityDetails from './CommunityDetails';
import CommunityMembers from './CommunityMembers';
import CommunityAvatar from './CommunityAvatar';
import Invitation from './Invitation';
import CreateUserToCommunity from './CreateUserToCommunity';
import CommunityEmails from './CommunityEmails';
import {type GetCommunityResponse} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import {useTitle} from '@/context/pageTitleContext';
import {useToasts} from '@/components/toasts';
import {useCurrentUser} from '@/context/currentUserContext';

export default function CommunitySettingsPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [community, setCommunity] = useState<GetCommunityResponse | undefined>(
    undefined,
  );
  const {id} = useParams();
  const {setTitle} = useTitle();
  const {currentUser} = useCurrentUser();

  useEffect(() => {
    if (!community) {
      return;
    }

    setTitle(community.name);
  }, [setTitle, community]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const getCommunity = async () => {
      try {
        const community = await api.getCommunity({id});
        setCommunity(community);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while loading the community`),
        });
      }
    };

    void getCommunity();
  }, [id, toasts, _]);

  if (!community || !currentUser) {
    return null;
  }

  const {_id, name, description, timezone, avatar} = community;

  return (
    <Tabs defaultActiveKey="details" id="community-settings" className="mb-3">
      <Tab eventKey="details" title={<Trans>Details</Trans>}>
        <CommunityDetails
          communityId={_id}
          communityName={name}
          communityDescription={description}
          communityTimezone={timezone}
        />
      </Tab>
      <Tab eventKey="avatar" title={<Trans>Avatar</Trans>}>
        <CommunityAvatar
          communityId={_id}
          communityName={name}
          communityAvatar={avatar ?? ''}
        />
      </Tab>
      <Tab eventKey="members" title={<Trans>Members</Trans>}>
        <CommunityMembers communityId={_id} />
      </Tab>
      {currentUser.roles.includes('super-admin') && (
        <Tab eventKey="emails" title={<Trans>Emails</Trans>}>
          <CommunityEmails communityId={_id} />
        </Tab>
      )}
      <Tab eventKey="create-user" title={<Trans>Create User</Trans>}>
        <CreateUserToCommunity communityId={_id} />
      </Tab>
      <Tab eventKey="invite" title={<Trans>Invite</Trans>}>
        <Invitation communityId={_id} />
      </Tab>
    </Tabs>
  );
}
