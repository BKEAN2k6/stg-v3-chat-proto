import {Link, useNavigate} from 'react-router-dom';
import {Nav, NavDropdown} from 'react-bootstrap';
import clsx from 'clsx';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import Avatar from '../ui/Avatar';
import {useCurrentUser} from '@/context/currentUserContext';
import {useToasts} from '@/components/toasts';
import {colorFromId} from '@/helpers/avatars';

type Props = {
  readonly isCompact?: boolean;
};

export default function CommunityDropdown(props: Props) {
  const {_} = useLingui();
  const {isCompact} = props;
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
    (community) => community._id === selectedCommunity,
  );

  if (!currentCommunity) {
    currentCommunity = communities[0];
  }

  const {
    avatar: communityAvatar,
    name: communityName,
    role: communityRole,
    _id: communityId,
  } = currentCommunity;

  return (
    <NavDropdown
      title={
        <div className="d-flex align-items-center ms-0 ms-md-2 ms-xl-0">
          <Avatar
            color={colorFromId(communityId)}
            name={communityName}
            path={communityAvatar}
            size={32}
            className="me-2"
          />
          <div
            className={clsx(
              'text-truncate',
              'd-block d-md-none d-xl-block',
              isCompact && 'responsive-dropdown-title',
            )}
          >
            {communityName}
          </div>
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
            key={community._id}
            as="li"
            style={{maxWidth: 160}}
            onClick={async () => handleCommunityChange(community._id)}
          >
            <Nav.Link className="text-truncate">{community.name}</Nav.Link>
          </NavDropdown.Item>
        ))}
      </div>
      {communityRole === 'admin' && (
        <>
          <NavDropdown.Divider />
          <NavDropdown.Item as="li">
            <Nav.Link as={Link} to={`/communities/${communityId}/settings`}>
              <Trans>Community Settings</Trans>
            </Nav.Link>
          </NavDropdown.Item>
        </>
      )}
    </NavDropdown>
  );
}
