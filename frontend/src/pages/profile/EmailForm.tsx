import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

export default function EmailForm() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const {currentUser} = useCurrentUser();

  const handleSave = async () => {
    try {
      await api.updateMyEmail({
        password,
        email,
      });

      setEmailSent(true);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(
          msg`Failed to update email. Check your password and try again.`,
        ),
      });
    }
  };

  if (emailSent) {
    return (
      <p>
        <Trans>
          An email has been sent to <strong>{email}</strong>. Check your inbox
          for further instructions.
        </Trans>
      </p>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        await handleSave();
      }}
    >
      <p>
        <Trans>
          Your current email is <strong>{currentUser.email}</strong>.
        </Trans>
      </p>

      <Form.Group className="mb-3" controlId="new-password-check">
        <Form.Label>
          <Trans>New email</Trans>
        </Form.Label>
        <Form.Control
          required
          type="email"
          autoComplete="email"
          placeholder={_(msg`Your new email address`)}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>
          <Trans>Password</Trans>
        </Form.Label>
        <Form.Control
          required
          autoComplete="password"
          type="password"
          placeholder={_(msg`Your current password`)}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        <Trans>Submit</Trans>
      </Button>
    </Form>
  );
}
