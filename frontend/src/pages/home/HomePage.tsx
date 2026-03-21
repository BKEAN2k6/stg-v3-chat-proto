import {useEffect, useState} from 'react';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {type StrengthSlug} from '@client/ApiTypes.js';
import Achievements from './components/Achievements/Achievements.js';
import CommunityStats from './components/CommunityStats.js';
import Posts from './components/Posts.js';
import StrengthCarousel from './components/StrengthCarousel/StrengthCarousel.js';
import LastActiveGoal from './components/LastActiveGoal.js';
import OnboardingBanner from './components/Onboarding/OnboardingBanner.js';
import AiGuidanceBlock from './components/AiGuidanceBlock/AiGuidanceBlock.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useTitle} from '@/context/pageTitleContext.js';

export default function HomePage() {
  const {_} = useLingui();
  const {setTitle} = useTitle();
  const {currentUser} = useCurrentUser();
  const communityId = currentUser?.selectedCommunity;
  const [defaultStrength, setDefaultStrength] = useState<StrengthSlug>();

  useEffect(() => {
    setTitle(_(msg`Home`));
  }, [setTitle, _]);

  if (!communityId) {
    return null;
  }

  return (
    <Row className="g-0">
      <Col>
        <OnboardingBanner />
        <AiGuidanceBlock />
        <StrengthCarousel
          className="mb-3"
          onStrengthChange={setDefaultStrength}
        />
        <Posts communityId={communityId} />
      </Col>
      <Col xl={3} className="d-none d-xl-block">
        <div className="ps-3 d-flex flex-column gap-3">
          {defaultStrength ? (
            <LastActiveGoal defaultStrength={defaultStrength} />
          ) : null}
          <Achievements />
          <CommunityStats communityId={communityId} />
        </div>
      </Col>
    </Row>
  );
}
