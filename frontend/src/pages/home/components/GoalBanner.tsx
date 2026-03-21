import {useState} from 'react';
import {Alert, Button, Modal} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import {useNavigate} from 'react-router-dom';

export default function GoalBanner() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleGoToGoals = () => {
    navigate('/strength-goals');
  };

  return (
    <>
      <Alert
        className="pb-0 pt-2 px-1 px-md-3 mb-3"
        style={{backgroundColor: '#f5b28c', borderColor: '#ef7f40'}}
      >
        <div className="d-flex">
          <div className="flex-grow-1 d-flex flex-column p-3">
            <h3>
              <Trans>New feature: Goals</Trans>
            </h3>
            <p className="m-0">
              <Trans>
                Latest addition to See The Good! tools. Try already today!
              </Trans>
            </p>
            <div className="mt-auto align-self-start d-flex gap-3">
              <Button variant="primary" onClick={handleGoToGoals}>
                <Trans>Open goals</Trans>
              </Button>
              <Button variant="white" onClick={handleShow}>
                <Trans>Read more</Trans>
              </Button>
            </div>
          </div>
          <div className="d-flex align-items-end d-none d-lg-block">
            <img
              className="me-3"
              style={{height: 150}}
              src="/images/banner-images/varis-point.png"
              alt="Dance Challenge"
            />
          </div>
        </div>
      </Alert>
      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>New goalsetter</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            <Trans>Hi Teacher!</Trans>
          </h5>
          <p>
            <Trans>
              Do you know that moment when the whole class succeeds together? We
              want to help make those moments part of your everyday classroom
              experience.
            </Trans>
          </p>
          <p>
            <Trans>
              The new Goal Setter supports the intentional practice of
              social-emotional skills and character strengths. It makes progress
              visible, helps students put their successes into words, and
              strengthens your classroom community in concrete, measurable ways.
            </Trans>
          </p>
          <h5>
            <Trans>How does it work?</Trans>
          </h5>
          <p>
            <Trans>
              Set a goal with your students. Notice their efforts and use the
              tool to document their practice. Invite students to reflect on
              what went well and celebrate their progress together.
            </Trans>
          </p>
          <p>
            <Trans>
              Achieving goals becomes a shared experience - one that builds
              connection and motivation.
            </Trans>
          </p>
          <p>
            <Trans>
              The Goal Setter is ready to use in the See the Good! lesson
              materials. Try it out today!
            </Trans>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
