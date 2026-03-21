import {Button, Offcanvas, Row, Col} from 'react-bootstrap';
import {List} from 'react-bootstrap-icons';
import {useState} from 'react';
import useBreakpoint from '../hooks/useBreakpoint';
import CommunityDropdown from './menu/CommunityDropdown';
import UserMenu from './menu/UserMenu';
import NotificationsMenu from './menu/NotificationsMenu';
import SideMenu from './menu/SideMenu';

export default function TopBar() {
  const breakpoint = useBreakpoint();
  const [showOffcanvasNavi, setShowOffcanvasNavi] = useState(false);

  const handleNaviToggleClick = () => {
    setShowOffcanvasNavi(true);
  };

  const handleOffcanvasNaviHide = () => {
    setShowOffcanvasNavi(false);
  };

  return (
    <>
      <Offcanvas
        show={showOffcanvasNavi && ['xs', 'sm'].includes(breakpoint)}
        onHide={handleOffcanvasNaviHide}
      >
        <Offcanvas.Body className="p-0">
          <SideMenu isInOffcanvas onNavigate={handleOffcanvasNaviHide} />
        </Offcanvas.Body>
      </Offcanvas>
      <Row className="g-0 p-2 position-sticky top-0 z-3 bg-white border-bottom">
        <Col className="g-0">
          <Button
            className="d-md-none btn-lg py-0 px-1"
            variant="link"
            style={{color: '#000'}}
            onClick={handleNaviToggleClick}
          >
            <List />
          </Button>
          <div className="g-0 d-none d-md-block">
            <CommunityDropdown />
          </div>
        </Col>
        <Col className="g-0 d-flex justify-content-end">
          <NotificationsMenu />
          <UserMenu />
        </Col>
      </Row>
    </>
  );
}
