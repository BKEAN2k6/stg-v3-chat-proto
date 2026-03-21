import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {Trans} from '@lingui/macro';
import {useCurrentUser} from '@/context/currentUserContext';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker';
import Wordmark from '@/components/ui/Wordmark';
import LoginModal from '@/components/LoginModal';

export default function LoginPage() {
  const navigate = useNavigate();
  const {currentUser} = useCurrentUser();
  const [searchParameters] = useSearchParams();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (searchParameters.has('showLogin')) {
      setIsLoginModalOpen(true);
    }
  }, [searchParameters]);

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterClick = () => {
    navigate('/register/code');
  };

  if (currentUser) {
    navigate('/');
    return null;
  }

  return (
    <>
      <Container>
        <div className="d-flex flex-column justify-content-center align-items-center gap-4">
          <Wordmark style={{width: 212}} className="mt-5" />
          <div className="px-4">
            <img
              src="/images/start-page-image.png"
              alt="Teamwork"
              style={{width: '100%', maxWidth: '375px'}}
            />
          </div>
          <Button style={{width: 180}} onClick={handleLoginModalOpen}>
            <Trans>Login</Trans>
          </Button>
          <Button
            variant="outline-primary"
            style={{width: 200}}
            onClick={handleRegisterClick}
          >
            <Trans>Join a community</Trans>
          </Button>
          <div className="mb-5">
            <GlobalLanguagePicker />
          </div>
        </div>
      </Container>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </>
  );
}
