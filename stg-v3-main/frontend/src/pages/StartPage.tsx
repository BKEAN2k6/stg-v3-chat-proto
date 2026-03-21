import {Trans} from '@lingui/react/macro';
import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Modal} from 'react-bootstrap';
import {useCurrentUser} from '@/context/currentUserContext.js';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';
import Wordmark from '@/components/ui/Wordmark.js';
import LoginModal from '@/components/LoginModal.js';
import {track} from '@/helpers/analytics.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const {currentUser} = useCurrentUser();
  const [searchParameters] = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);

  useEffect(() => {
    if (searchParameters.has('showLogin')) {
      setIsLoginModalOpen(true);
    }

    if (searchParameters.get('from') === 'old') {
      track('Redirected from old version');
      setIsRedirectModalOpen(true);
    }
  }, [searchParameters]);

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleFromOldModalClose = () => {
    setIsRedirectModalOpen(false);
  };

  const handleCodeRegisterClick = () => {
    navigate('/register/code');
  };

  const handleRegisterClick = () => {
    navigate('/register/user');
  };

  if (currentUser) {
    navigate('/');
    return null;
  }

  return (
    <>
      <Container>
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Wordmark style={{width: 212}} className="mt-5" />
          <div className="px-4">
            <img
              src="/images/start-page-image.png"
              alt="Teamwork"
              style={{width: '100%', maxWidth: '300px'}}
            />
          </div>
          <Button style={{width: 200}} onClick={handleLoginModalOpen}>
            <Trans>Login</Trans>
          </Button>
          <Button
            variant="outline-primary"
            style={{width: 200}}
            onClick={handleRegisterClick}
          >
            <Trans>Register</Trans>
          </Button>
          <Button
            variant="outline-primary"
            style={{width: 200}}
            onClick={handleCodeRegisterClick}
          >
            <Trans>Join a community</Trans>
          </Button>
          <div className="mb-5">
            <GlobalLanguagePicker />
          </div>
        </div>
      </Container>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
      <Modal show={isRedirectModalOpen} onHide={handleFromOldModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>We&#39;ve moved to a new version!</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Trans>
            You were redirected from the old version of our service, which is no
            longer in use. Log in if you already have an account on the new
            version, or please sign up if you haven&#39;t yet.
          </Trans>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFromOldModalClose}>
            <Trans>Close</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
