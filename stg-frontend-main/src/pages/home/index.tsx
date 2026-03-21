import {useEffect} from 'react';
import {msg} from '@lingui/macro';
import {useSearchParams} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {useTracking} from 'react-tracking';
import CommunityStats from './CommunityStats';
import Posts from './Posts';
import StrengthTimelineCarousel from './components/StrengthTimeline/StrengthTimelineCarousel';
import HolidayCalendar from './components/HolidayCalendarTimeline/HolidayCalendar';
import {useCurrentUser} from '@/context/currentUserContext';
import {useTitle} from '@/context/pageTitleContext';
import useBreakpoint from '@/hooks/useBreakpoint';

export default function HomePage() {
  const [searchParameters] = useSearchParams();
  const {_} = useLingui();
  const breackpoint = useBreakpoint();

  const isSmallScreen = !['xl', 'xxl'].includes(breackpoint ?? '');

  const {setTitle} = useTitle();
  const {currentUser} = useCurrentUser();
  const {trackEvent, Track} = useTracking<Trackables>({
    page: 'home',
    path: window.location.pathname,
  });

  const communityId = currentUser?.selectedCommunity;
  const currentTime = new Date(
    searchParameters.get('currentTime') ?? Date.now(),
  );
  const holidayCalendarStart = new Date('2024-11-25');
  const holidayCalendarEnd = new Date('2025-01-05');
  const showHolidayCalendar =
    currentTime >= holidayCalendarStart && currentTime < holidayCalendarEnd;

  useEffect(() => {
    setTitle(_(msg`Home`));
  }, [setTitle, _]);

  if (!currentUser || !communityId) {
    return null;
  }

  trackEvent({
    action: 'page-view',
    path: window.location.pathname,
  });

  if (isSmallScreen) {
    return (
      <Track>
        <Tabs fill defaultActiveKey="content" id="feed-tabs" className="pt-3">
          <Tab eventKey="content" title={_(msg`Moments`)} className="mt-4">
            {showHolidayCalendar ? (
              <HolidayCalendar />
            ) : (
              <StrengthTimelineCarousel />
            )}

            <Posts key={communityId} communityId={communityId} />
          </Tab>
          <Tab eventKey="sidebar" title={_(msg`Overview`)} className="my-4">
            <CommunityStats communityId={communityId} />
          </Tab>
        </Tabs>
      </Track>
    );
  }

  return (
    <Track>
      <Row className="g-0">
        <Col>
          {showHolidayCalendar ? (
            <HolidayCalendar />
          ) : (
            <StrengthTimelineCarousel />
          )}
          <Posts key={communityId} communityId={communityId} />
        </Col>

        <Col xs={0} xl={3} className="d-none d-xl-block ps-3">
          <CommunityStats communityId={communityId} />
        </Col>
      </Row>
    </Track>
  );
}
