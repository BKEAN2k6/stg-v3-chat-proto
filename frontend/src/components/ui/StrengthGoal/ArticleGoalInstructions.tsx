import {Trans} from '@lingui/react/macro';
import {Button, Fade, Modal} from 'react-bootstrap';
import stopPropagationHandlers from './stopPropagationHandlers.js';

type Properties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export default function ArticleGoalInstructions({isOpen, onClose}: Properties) {
  return (
    <Fade mountOnEnter unmountOnExit in={isOpen}>
      <>
        <div
          {...stopPropagationHandlers}
          style={{
            zIndex: 10_003,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={onClose}
        />
        <div
          className="modal show"
          style={{
            display: 'block',
            position: 'initial',
          }}
        >
          <Modal.Dialog
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10_004,
              margin: 0,
            }}
          >
            <Modal.Header closeButton onHide={onClose}>
              <Modal.Title as="h5">
                <Trans>Lesson goals</Trans>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{
                maxHeight: '55vh',
                overflowY: 'auto',
              }}
            >
              <Trans>
                <p>
                  To keep young learners engaged, your lesson slides include a
                  fun goal-setting feature!
                </p>
                <p>
                  Each lesson can have a goal, and every time a student
                  participates, whether by answering a question, sharing a
                  thought, or taking part in an activity, the teacher or a
                  student can tap the goal button on the screen. This moves the
                  progress bar forward, creating a sense of achievement.
                </p>
                <p className="mb-0">
                  Once the goal is reached, a celebration appears, reinforcing
                  positive engagement and participation. Use this feature to
                  make learning about character strengths interactive and
                  rewarding!
                </p>
              </Trans>
            </Modal.Body>
            <Modal.Footer
              className="text-end"
              style={{
                backgroundColor: 'var(--bs-light)',
              }}
            >
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                <Trans>Close</Trans>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </>
    </Fade>
  );
}
