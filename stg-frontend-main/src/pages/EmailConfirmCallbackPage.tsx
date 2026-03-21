import Container from 'react-bootstrap/Container';
import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate, Link} from 'react-router-dom';
import {Trans} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {Loader} from '@/components/ui/Loader';

const isJwtExpired = (token: string) => {
  const {exp} = JSON.parse(atob(token.split('.')[1])) as {exp: number};
  const now = Date.now() / 1000;
  return exp < now;
};

export default function EmailConfirmCallbackPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [searchParameters] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParameters.get('token');
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [isVerifiationFailed, setIsVerifiationFailed] =
    useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      if (isJwtExpired(token)) {
        return;
      }

      try {
        await api.confirmEmail({token});
        setEmailVerified(true);
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } catch {
        setIsVerifiationFailed(true);
      }
    };

    void verifyEmail();
  }, [toasts, token, navigate, _]);

  const getMeassge = () => {
    if (emailVerified) {
      return (
        <>
          <h1 className="display-6">
            <Trans>Your email has been verified.</Trans>
          </h1>
          <p>
            <Trans>
              You will now redicted to the{' '}
              <Link to="/profile">profile page</Link> in a few seconds.
            </Trans>
          </p>
        </>
      );
    }

    if (isVerifiationFailed) {
      return (
        <>
          <h1 className="display-6">
            <Trans>Failed to verify email.</Trans>
          </h1>
          <p>
            <Trans>
              Try setting your email again. In the{' '}
              <Link to="/profile">profile page</Link>
            </Trans>
          </p>
        </>
      );
    }

    if (token && isJwtExpired(token)) {
      return (
        <>
          <h1 className="display-6">
            <Trans>The link has expired.</Trans>
          </h1>
          <p>
            <Trans>
              Try setting your email again. In the{' '}
              <Link to="/profile">profile page</Link>
            </Trans>
          </p>
        </>
      );
    }

    return <Loader />;
  };

  return (
    <Container className="py-5">
      <div className="d-flex flex-column align-items-center">
        {getMeassge()}
      </div>
    </Container>
  );
}
