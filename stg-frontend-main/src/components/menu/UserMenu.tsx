import {Link} from 'react-router-dom';
import {Nav, NavDropdown} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import Avatar from '../ui/Avatar';
import {useCurrentUser} from '@/context/currentUserContext';
import {colorFromId, formatName} from '@/helpers/avatars';

export default function UserMenu() {
  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <NavDropdown
      align="end"
      title={
        <div className="d-flex align-items-center">
          <Avatar
            color={colorFromId(currentUser._id)}
            name={formatName(currentUser)}
            path={currentUser.avatar}
            size={32}
          />
        </div>
      }
      className="hide-icon"
    >
      <NavDropdown.Item as="li">
        <Nav.Link as={Link} to="/profile">
          <Trans>Profile</Trans>
        </Nav.Link>
      </NavDropdown.Item>
      <NavDropdown.Item as="li">
        <Nav.Link as={Link} to="/logout">
          <Trans>Log out</Trans>
        </Nav.Link>
      </NavDropdown.Item>
    </NavDropdown>
  );
}
