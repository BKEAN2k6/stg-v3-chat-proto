import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';

export default function ForgotPasswordPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [email, setEmail] = useState('');
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await api.emailAuth({
        email,
        resetPassword,
      });
      setEmailSent(true);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong.`),
      });
    }
  };

  if (emailSent) {
    return (
      <Container className="py-5">
        <div className="d-flex flex-column align-items-center">
          <p className="w-100 w-md-75 px-5">
            <Trans>
              A link has been sent to your email. Please open it with the device
              that you want to login with.
            </Trans>
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex flex-column align-items-center">
        <Form className="w-100 w-md-75 px-5" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>
              <Trans>Email address</Trans>
            </Form.Label>
            <Form.Control
              required
              type="email"
              placeholder={_(msg`Enter your email`)}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="reset-password">
            <Form.Check // prettier-ignore
              checked={resetPassword}
              label={_(msg`Reset my password`)}
              onChange={(event) => {
                setResetPassword(event.target.checked);
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            <Trans>Submit</Trans>
          </Button>
        </Form>
      </div>
    </Container>
  );
}
