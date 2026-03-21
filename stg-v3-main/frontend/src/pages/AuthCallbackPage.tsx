import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate, Link} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import CenteredLoader from '@/components/CenteredLoader.js';

const isJwtExpired = (token: string) => {
  const {exp} = JSON.parse(globalThis.atob(token.split('.')[1])) as {
    exp: number;
  };
  const now = Date.now() / 1000;
  return exp < now;
};

export default function AuthCallbackPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [searchParameters] = useSearchParams();
  const [isPasswordChangeAllowed, setIsPasswordChangeAllowed] =
    useState<boolean>(false);
  const [forcePasswordChange, setForcePasswordChange] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const navigate = useNavigate();
  const token = searchParameters.get('token');

  useEffect(() => {
    if (!token || isPasswordChangeAllowed) {
      return;
    }

    const login = async () => {
      if (isJwtExpired(token)) {
        return;
      }

      try {
        const response = await api.magicLogin({token});

        if (response.allowPasswordChange) {
          setIsPasswordChangeAllowed(true);
          if (response.forcePasswordChange) {
            setForcePasswordChange(true);
          }

          return;
        }

        navigate('/');
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while logging in`),
        });
      }
    };

    // This is a workaround for a rare race condition in the backend where the connect.sid cookie is out of sync
    const timer = setTimeout(() => {
      void login();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toasts, token, navigate, isPasswordChangeAllowed, _]);

  const handleSave = async () => {
    try {
      if (newPassword.length < 8) {
        throw new Error('The password must be at least 8 characters long');
      }

      await api.updateMe({
        newPassword,
      });

      navigate('/');
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the password`),
      });
    }
  };

  if (!token || isJwtExpired(token)) {
    return (
      <Container className="py-5">
        <div className="d-flex flex-column align-items-center">
          <p className="w-100 w-md-75 px-5">
            <Trans>
              The link has expired. Please request a new link
              <Link to="/forgot-password" className="ms-1">
                here
              </Link>
              .
            </Trans>
          </p>
        </div>
      </Container>
    );
  }

  if (isPasswordChangeAllowed) {
    return (
      <Container className="mt-3">
        <p className="mb-3">
          <Trans>Set a password for your account</Trans>:
        </p>
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            await handleSave();
          }}
        >
          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              required
              minLength={8}
              type="password"
              placeholder={_(msg`Password`)}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
            />
            <Form.Text muted>
              <Trans>Your password must be at least 8 characters long.</Trans>
            </Form.Text>
          </Form.Group>
          {!forcePasswordChange && (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate('/');
                }}
              >
                <Trans>Skip</Trans>
              </Button>{' '}
            </>
          )}
          <Button variant="primary" type="submit">
            <Trans>Submit</Trans>
          </Button>
        </Form>
        {!forcePasswordChange && (
          <>
            <br />
            <p>
              <Trans>
                You can also skip this step and log in again with a email.
              </Trans>
            </p>
          </>
        )}
      </Container>
    );
  }

  return (
    <CenteredLoader>
      <p className="fw-bold text-muted">
        <Trans>Verifying your account.</Trans>
      </p>
    </CenteredLoader>
  );
}
