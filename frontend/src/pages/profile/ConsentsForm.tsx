import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useLingui} from '@lingui/react';
import {type GetMeResponse} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';

type ConsentsFormProperties = {
  readonly currentUser: GetMeResponse;
  readonly setCurrentUser: (user: GetMeResponse) => void;
};

export default function ConsentsForm({
  currentUser,
  setCurrentUser,
}: ConsentsFormProperties) {
  const {_} = useLingui();
  const toasts = useToasts();

  const [vimeoConsent, setVimeoConsent] = useState<boolean>(
    currentUser.consents?.vimeo ?? false,
  );

  const handleSave = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updatedUser = await api.updateMe({
        consents: {
          vimeo: vimeoConsent,
        },
      });

      setCurrentUser({...currentUser, ...updatedUser});
      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`Your profile settings have been updated.`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving your profile settings.`),
      });
    }
  };

  return (
    <Form onSubmit={handleSave}>
      <Form.Group className="mb-3" controlId="consent-vimeo">
        <Form.Check
          type="checkbox"
          label={_(msg`Allow Vimeo cookies`)}
          checked={vimeoConsent}
          onChange={(event) => {
            setVimeoConsent(event.target.checked);
          }}
        />
        <Form.Text className="text-muted">
          <Trans>
            Enabling Vimeo cookies allows videos hosted on{' '}
            <a href="https://vimeo.com" target="_blank" rel="noreferrer">
              vimeo.com
            </a>{' '}
            to be displayed on our site. If you disable this option, videos from
            Vimeo will not be visible.
          </Trans>
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        <Trans>Save</Trans>
      </Button>
    </Form>
  );
}
