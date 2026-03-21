import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useLingui} from '@lingui/react';
import {type GetMeResponse, type LanguageCode} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import {languages} from '@/i18n.js';
import {useLanguage} from '@/context/languageContext.js';

type Properties = {
  readonly currentUser: GetMeResponse;
  readonly setCurrentUser: (user: GetMeResponse) => void;
};

export default function DetailsForm(properties: Properties) {
  const {_} = useLingui();
  const toasts = useToasts();
  const {currentUser, setCurrentUser} = properties;
  const [firstName, setFirstName] = useState<string>(currentUser.firstName);
  const [lastName, setLastName] = useState<string>(currentUser.lastName);
  const [language, setLanguage] = useState<LanguageCode>(currentUser.language);
  const {changeLanguage} = useLanguage();

  const handleSave = async () => {
    try {
      const updatedUser = await api.updateMe({
        firstName,
        lastName,
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
          onBlur={() => {
            setFirstName(firstName.trim());
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
          onBlur={() => {
            setLastName(lastName.trim());
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
