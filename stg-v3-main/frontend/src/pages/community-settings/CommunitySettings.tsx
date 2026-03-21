import {Trans} from '@lingui/react/macro';
import {useEffect, useState} from 'react';
import {Lock} from 'react-bootstrap-icons';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {type GetCommunityResponse} from '@client/ApiTypes';
import {type ApiError} from '@client/ApiClient';
import {type UseQueryResult, useQueryClient} from '@tanstack/react-query';
import {useGetCommunityQuery} from '@client/ApiHooks.js';
import CommunityDetails from './CommunityDetails.js';
import CommunityMembers from './CommunityMembers.js';
import CommunityAvatar from './CommunityAvatar.js';
import Invitation from './Invitation.js';
import CommunityEmails from './CommunityEmails.js';
import CommunityMemberInvitations from './CommunityMemberInvitations.js';
import CommunitySubscription from './CommunitySubcription.js';
import {useTitle} from '@/context/pageTitleContext.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type CommunitySettingsProperties = {
  readonly communityId: string;
  readonly initialCommunity?: GetCommunityResponse;
  readonly isPageTitleUpdateEnabled?: boolean;
};

export default function CommunitySettings({
  communityId,
  initialCommunity,
  isPageTitleUpdateEnabled = true,
}: CommunitySettingsProperties) {
  const [community, setCommunity] = useState<GetCommunityResponse | undefined>(
    initialCommunity,
  );
  const {setTitle} = useTitle();
  const {currentUser} = useCurrentUser();
  const [activeTab, setActiveTab] = useState('details');

  const communityQuery = useGetCommunityQuery(
    {id: communityId},
    {enabled: !initialCommunity},
  ) as UseQueryResult<GetCommunityResponse | undefined, ApiError>;
  const fetchedCommunity = communityQuery.data;
  const queryClient = useQueryClient();
  const isSuperAdmin = currentUser?.roles.includes('super-admin') ?? false;

  useEffect(() => {
    if (initialCommunity) {
      setCommunity(initialCommunity);
    } else if (fetchedCommunity) {
      setCommunity(fetchedCommunity);
    }
  }, [fetchedCommunity, initialCommunity]);

  useEffect(() => {
    if (!community || !isPageTitleUpdateEnabled) {
      return;
    }

    setTitle(community.name);
  }, [setTitle, community, isPageTitleUpdateEnabled]);

  useEffect(() => {
    if (!isSuperAdmin && activeTab === 'subscription') {
      setActiveTab('details');
    }
  }, [activeTab, isSuperAdmin]);

  if (!community || !currentUser) {
    return null;
  }

  const {id, name, description, timezone, avatar} = community;

  return (
    <>
      {currentUser.roles.includes('super-admin') && (
        <p className="text-muted">
          <Lock className="me-1" size={12} /> Content marked with a lock icon is
          only accessible to super-admins
        </p>
      )}
      <Tabs
        activeKey={activeTab}
        id="community-settings"
        className="mb-3"
        onSelect={(tabKey) => {
          setActiveTab(tabKey ?? 'details');
        }}
      >
        <Tab eventKey="details" title={<Trans>Details</Trans>}>
          <CommunityDetails
            communityId={id}
            communityName={name}
            communityDescription={description}
            communityTimezone={timezone}
            onUpdated={async () => {
              await queryClient.invalidateQueries({queryKey: ['billingGroup']});
            }}
          />
        </Tab>
        <Tab eventKey="avatar" title={<Trans>Avatar</Trans>}>
          <CommunityAvatar
            communityId={id}
            communityName={name}
            communityAvatar={avatar ?? ''}
          />
        </Tab>
        <Tab eventKey="members" title={<Trans>Members</Trans>}>
          <CommunityMembers communityId={id} />
        </Tab>
        <Tab eventKey="invitations" title={<Trans>Invitations</Trans>}>
          <CommunityMemberInvitations communityId={id} />
        </Tab>
        {currentUser.roles.includes('super-admin') && (
          <Tab
            eventKey="emails"
            title={
              <>
                <Lock className="me-1" size={12} />
                <Trans>Emails</Trans>
              </>
            }
          >
            <CommunityEmails communityId={id} />
          </Tab>
        )}
        {currentUser.roles.includes('super-admin') && (
          <Tab
            eventKey="invite"
            title={
              <>
                <Lock className="me-1" size={12} />
                <Trans>Invite</Trans>
              </>
            }
          >
            <Invitation communityId={id} />
          </Tab>
        )}
        {currentUser.roles.includes('super-admin') && (
          <Tab
            eventKey="subscription"
            title={
              <>
                <Lock className="me-1" size={12} />
                <Trans>Subscription</Trans>
              </>
            }
          >
            <CommunitySubscription communityId={id} />
          </Tab>
        )}
      </Tabs>
    </>
  );
}
