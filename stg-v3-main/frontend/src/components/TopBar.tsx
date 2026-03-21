import {useState} from 'react';
import {Navbar, Nav, Container, Button, Offcanvas} from 'react-bootstrap';
import {ChevronRight, List} from 'react-bootstrap-icons';
import useBreakpoint from '../hooks/useBreakpoint.js';
import CommunityDropdown from './menu/CommunityDropdown.js';
import GroupDropdown from './menu/GroupDropdown.js';
import NotificationsMenu from './menu/NotificationsMenu.js';
import UserMenu from './menu/UserMenu.js';
import SideMenu from './menu/SideMenu.js';
import './TopBar.scss';

export default function TopBar() {
  const [showOffcanvasNavi, setShowOffcanvasNavi] = useState(false);
  const breakpoint = useBreakpoint();

  return (
    <>
      <Offcanvas
        show={showOffcanvasNavi ? ['xs', 'sm'].includes(breakpoint) : false}
        onHide={() => {
          setShowOffcanvasNavi(false);
        }}
      >
        <Offcanvas.Body className="p-0">
          <SideMenu
            isInOffcanvas
            onNavigate={() => {
              setShowOffcanvasNavi(false);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Navbar
        sticky="top"
        bg="white"
        className="position-sticky border-bottom py-0 top-bar"
      >
        <Container fluid className="g-0">
          <Button
            variant="link"
            className="d-md-none btn-lg p-2 text-black"
            onClick={() => {
              setShowOffcanvasNavi(true);
            }}
          >
            <List />
          </Button>

          <Nav className="flex-row d-none d-md-flex">
            <CommunityDropdown />
            <ChevronRight className="my-3" />
            <GroupDropdown />
          </Nav>

          <Nav className="flex-row align-items-center ms-auto">
            <NotificationsMenu />
            <UserMenu />
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
