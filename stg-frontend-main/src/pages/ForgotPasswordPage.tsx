import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useToasts} from '@/components/toasts';

export default function ForgotPasswordPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [email, setEmail] = useState('');
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [code, setCode] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch(`/api/v1/emailauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({destination: email, resetPassword}),
    });

    if (!response.ok) {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while logging in`),
      });

      return;
    }

    const {code} = (await response.json()) as {code: string};
    setCode(code);
  };

  if (code) {
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
