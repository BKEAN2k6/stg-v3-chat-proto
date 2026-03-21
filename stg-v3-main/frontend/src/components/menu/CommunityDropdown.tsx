import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Link, useNavigate} from 'react-router-dom';
import {NavDropdown} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import Avatar from '../ui/Avatar.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useToasts} from '@/components/toasts/index.js';
import {colorFromId} from '@/helpers/avatars.js';

export default function CommunityDropdown() {
  const {_} = useLingui();
  const {changeCommunity, currentUser} = useCurrentUser();
  const toasts = useToasts();
  const navigate = useNavigate();

  const handleCommunityChange = async (communityId: string) => {
    try {
      await changeCommunity(communityId);
      navigate('/');
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while changing community`),
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  const {communities, selectedCommunity} = currentUser;

  let currentCommunity = communities.find(
    (community) => community.id === selectedCommunity,
  );

  currentCommunity ??= communities[0];

  const {
    avatar: communityAvatar,
    name: communityName,
    role: communityRole,
    id: communityId,
  } = currentCommunity;

  return (
    <NavDropdown
      title={
        <div className="d-flex align-items-center">
          <Avatar
            isButton
            hasTooltip={false}
            color={colorFromId(communityId)}
            name={communityName}
            path={communityAvatar}
            size={32}
          />
        </div>
      }
      className="hide-icon"
    >
      <div
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        {currentUser.communities.map((community) => (
          <NavDropdown.Item
            key={community.id}
            active={community.id === selectedCommunity}
            onClick={async () => handleCommunityChange(community.id)}
          >
            {community.name}
          </NavDropdown.Item>
        ))}
      </div>

      {['admin', 'owner'].includes(communityRole) && (
        <>
          <NavDropdown.Divider />

          <NavDropdown.Item
            as={Link}
            to={`/communities/${communityId}/settings`}
          >
            <Trans>Community Settings</Trans>
          </NavDropdown.Item>
        </>
      )}

      <NavDropdown.Divider />

      <NavDropdown.Item as={Link} to="/community-invitations">
        <Trans>Your Invitations</Trans>
      </NavDropdown.Item>
    </NavDropdown>
  );
}
