import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate, Link} from 'react-router-dom';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useCurrentUser} from '@/context/currentUserContext';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {Loader} from '@/components/ui/Loader';

const isJwtExpired = (token: string) => {
  const {exp} = JSON.parse(atob(token.split('.')[1])) as {exp: number};
  const now = Date.now() / 1000;
  return exp < now;
};

export default function AuthCallbackPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [searchParameters] = useSearchParams();
  const [isPasswordChangeAllowed, setIsPasswordChangeAllowed] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const navigate = useNavigate();
  const {magicLogin} = useCurrentUser();
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
        const response = await magicLogin(token);

        if (response.allowPasswordChange) {
          setIsPasswordChangeAllowed(true);
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

    void login();
  }, [toasts, token, magicLogin, navigate, isPasswordChangeAllowed, _]);

  const handleSave = async () => {
    try {
      if (!newPassword) {
        throw new Error('The password cannot be empty');
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
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            await handleSave();
          }}
        >
          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              required
              type="password"
              placeholder="Your new password"
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
            />
          </Form.Group>
          <Button
            variant="secondary"
            onClick={() => {
              navigate('/');
            }}
          >
            Skip
          </Button>{' '}
          <Button variant="primary" type="submit">
            <Trans>Submit</Trans>
          </Button>
        </Form>
        <br />
        <p>
          <Trans>
            You can also skip this step and log in again with a email.
          </Trans>
        </p>
      </Container>
    );
  }

  return <Loader />;
}
