import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {type GetMeResponse} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {type LanguageCode, languages} from '@/i18n';
import {useLanguage} from '@/context/languageContext';

type Props = {
  readonly currentUser: GetMeResponse;
  readonly setCurrentUser: (user: GetMeResponse) => void;
};

export default function DetailsForm(props: Props) {
  const {_} = useLingui();
  const toasts = useToasts();
  const {currentUser, setCurrentUser} = props;
  const [firstName, setFirstName] = useState<string>(currentUser.firstName);
  const [lastName, setLastName] = useState<string>(currentUser.lastName);
  const [language, setLanguage] = useState<LanguageCode>(currentUser.language);
  const {changeLanguage} = useLanguage();

  const handleSave = async () => {
    try {
      const updatedUser = await api.updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        language,
      });

      changeLanguage(updatedUser.language);
      setCurrentUser({...currentUser, ...updatedUser});
      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);

      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`Your profile details have been updated`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the user`),
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
      <Form.Group className="mb-3" controlId="first-name">
        <Form.Label>
          <Trans>First name</Trans>
        </Form.Label>
        <Form.Control
          required
          type="text"
          value={firstName}
          placeholder={_(msg`First name`)}
          maxLength={20}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="last-name">
        <Form.Label>
          <Trans>Last Name</Trans>
        </Form.Label>
        <Form.Control
          required
          type="text"
          value={lastName}
          placeholder={_(msg`First name`)}
          maxLength={25}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="language">
        <Form.Label>
          <Trans>Language</Trans>
        </Form.Label>

        <Form.Select
          required
          defaultValue={language}
          onChange={(event) => {
            setLanguage(event.target.value as LanguageCode);
          }}
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {languages[lang as LanguageCode]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        <Trans>Submit</Trans>
      </Button>
    </Form>
  );
}
