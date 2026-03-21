import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';

export default function PasswordForm() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordCheck, setNewPasswordCheck] = useState<string>('');

  const handleSave = async () => {
    try {
      if (newPassword !== newPasswordCheck) {
        throw new Error('Passwords do not match');
      }

      await api.updateMe({
        password,
        newPassword,
      });

      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`Password updated`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Failed to update password`),
      });
    }
  };

  return (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        await handleSave();
      }}
    >
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>
          <Trans>Current password</Trans>
        </Form.Label>
        <Form.Control
          required
          autoComplete="current-password"
          type="password"
          placeholder={_(msg`Your current password`)}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="new-password">
        <Form.Label>
          <Trans>New password</Trans>
        </Form.Label>
        <Form.Control
          required
          type="password"
          autoComplete="new-password"
          placeholder={_(msg`Your new password`)}
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="new-password-check">
        <Form.Label>
          <Trans>Confirm your new password</Trans>
        </Form.Label>
        <Form.Control
          required
          type="password"
          autoComplete="new-password"
          placeholder={_(msg`Your new password again`)}
          onChange={(event) => {
            setNewPasswordCheck(event.target.value);
          }}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        <Trans>Submit</Trans>
      </Button>
    </Form>
  );
}
