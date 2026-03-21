import {useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {Row, Col, Button} from 'react-bootstrap';
import {useTracking} from 'react-tracking';
import {useCurrentUser} from '@/context/currentUserContext';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {useTitle} from '@/context/pageTitleContext';

function openInNewTab(url: string) {
  const win = window.open(url, '_blank');
  win?.focus();
}

export default function CreateSprintPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();
  const {setTitle} = useTitle();
  const {trackEvent} = useTracking<Trackables>({
    page: 'create-sprint',
    path: window.location.pathname,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    trackEvent({
      action: 'click',
      element: 'create-sprint-button',
    });
    event.preventDefault();

    const selectedCommunity = currentUser?.selectedCommunity;
    if (!selectedCommunity) return false;

    try {
      const sprint = await api.createCommunitySprint({
        id: selectedCommunity,
      });
      openInNewTab(`/games/sprints/${sprint._id}/host`);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating sprint`),
      });
    }
  };

  useEffect(() => {
    setTitle(_(msg`Strength sprint`));
  }, [_, setTitle]);

  trackEvent({action: 'page-view'});

  return (
    <Form onSubmit={handleSubmit}>
      <h2>
        <Trans>Strength sprint</Trans>
      </h2>
      <hr
        style={{
          margin: '0',
          marginBottom: '1rem',
        }}
      />
      <Row>
        <Col xs={12} lg={7}>
          <p>
            <Trans>
              Strength sprint is an engaging and interactive activity designed
              to foster a positive and supportive classroom environment. It
              allows students to recognize and celebrate each other&apos;s
              unique character strengths, promoting a culture of encouragement
              and mutual respect.
            </Trans>
          </p>
          <p>
            <Trans>
              During the sprint, students use their devices to select strengths
              that best describe their peers, such as creativity, courage,
              kindness, and many others. This experience not only helps students
              appreciate the diverse qualities within their classroom community
              but also nurtures self-awareness and empathy.
            </Trans>
          </p>
          <p>
            <Trans>
              As a teacher, you will guide the activity, setting the stage for
              an uplifting and reflective experience. At the end of the sprint,
              students will receive a list of strengths as seen by their
              classmates, offering a valuable opportunity for personal growth
              and positive reinforcement.
            </Trans>
          </p>
          <p>
            <Trans>
              Start a new sprint and watch as your classroom discovers and
              celebrates the strengths within!
            </Trans>
          </p>
          <Button variant="primary" type="submit">
            <Trans>Start sprint</Trans>
          </Button>
        </Col>
        <Col md={5} className="d-none d-lg-block">
          <img
            src="/images/start-page-image.png"
            alt="Strength sprint is fun!"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Form>
  );
}
