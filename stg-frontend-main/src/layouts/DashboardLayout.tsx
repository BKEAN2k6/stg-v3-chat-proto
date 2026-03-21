import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PostModal from '@/components/ui/PostModal';
import TopBar from '@/components/TopBar';
import SideMenu from '@/components/menu/SideMenu';
import useBreakpoint from '@/hooks/useBreakpoint';

type Props = {
  readonly children: React.ReactNode;
};

export default function DashboardLayout(props: Props) {
  const {children} = props;
  const breakpoint = useBreakpoint();

  const style = ['xs', 'sm', 'md', 'lg', 'xl'].includes(breakpoint)
    ? {width: 65}
    : {};
  return (
    <Container className="px-0">
      <TopBar />
      <Row className="g-0">
        <Col md={1} xxl={2} className="d-none d-md-block" style={style}>
          <SideMenu />
        </Col>
        <Col className="p-3 pe-xl-0 overflow-hidden">{children}</Col>
      </Row>
      <PostModal />
    </Container>
  );
}
