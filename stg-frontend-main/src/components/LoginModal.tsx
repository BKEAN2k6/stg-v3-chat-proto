import {Button, Form, Modal} from 'react-bootstrap';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useToasts} from './toasts';
import Callout from './ui/Callout';
import TextInput from './ui/TextInput';
import api from '@/api/ApiClient';

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly prefilledEmail?: string;
  readonly invitationCode?: string;
  readonly targetCommunityName?: string;
  readonly onLogin?: () => void;
};

export default function LoginModal(props: Props) {
  const toasts = useToasts();
  const {_} = useLingui();
  const {
    isOpen,
    onClose,
    prefilledEmail,
    invitationCode,
    targetCommunityName,
    onLogin,
  } = props;

  const [searchParameters] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(prefilledEmail ?? '');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFailed(false);
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFailed(false);
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginFailed(false);

    try {
      await api.login({email, password, invitationCode});
      if (onLogin) {
        onClose();
        onLogin();
        return;
      }

      const parameterRedirect = searchParameters.get('redirect');
      if (parameterRedirect) {
        navigate(parameterRedirect);
        return;
      }

      navigate('/');
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Check your email and password.`),
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [prefilledEmail]);

  return (
    <Modal centered show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Trans>Welcome back</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        {targetCommunityName && (
          <Callout>
            <p>
              <Trans>An account with this email already exists.</Trans>
            </p>
            <p className="mb-0">
              <Trans>
                Please enter your password and you will be added to{' '}
                {targetCommunityName}
              </Trans>
            </p>
          </Callout>
        )}
        <Form onSubmit={handleSubmit}>
          <TextInput
            isRequired
            className="mb-3"
            isInvalid={loginFailed}
            controlId="email"
            type="email"
            label={_(msg`Email address`)}
            placeholder={_(msg`Email address`)}
            value={email}
            onChange={handleEmailChange}
          />

          <TextInput
            isRequired
            className="mb-3"
            isInvalid={loginFailed}
            controlId="password"
            type="password"
            label={_(msg`Password`)}
            placeholder={_(msg`Password`)}
            onChange={handlePasswordChange}
          />

          <Button variant="primary" type="submit" className="w-100">
            <Trans>Login</Trans>
          </Button>
          {loginFailed && (
            <p className="text-danger">
              <Trans>Login failed</Trans>
            </p>
          )}
        </Form>
        {/* NOTE: disabled if triggered during onboarding, since the emailauth doesn't support passing in an invitationCode */}
        {!targetCommunityName && (
          <a href="/forgot-password">
            <Trans>Forgot password?</Trans>
          </a>
        )}
      </Modal.Body>
    </Modal>
  );
}
