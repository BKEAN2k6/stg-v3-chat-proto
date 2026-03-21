import {msg} from '@lingui/core/macro';
import React, {useState} from 'react';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm.js';
import TextInput from '@/components/ui/TextInput.js';

type Properties = {
  readonly onSubmit: (firstName: string, lastName: string) => void;
};

export default function NamesForm(properties: Properties) {
  const {_} = useLingui();
  const {onSubmit: onComlete} = properties;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameInvalid, setFirstNameInvalid] = useState<
    boolean | undefined
  >();
  const [firstNameValid, setFirstNameValid] = useState<boolean | undefined>();
  const [lastNameInvalid, setLastNameInvalid] = useState<boolean | undefined>();
  const [lastNameValid, setLastNameValid] = useState<boolean | undefined>();

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {value} = event.target;
    setFirstName(value);
    setFirstNameInvalid(!value.trim());
    setFirstNameValid(value.trim().length > 0);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setLastName(value);
    setLastNameInvalid(!value.trim());
    setLastNameValid(value.trim().length > 0);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComlete(firstName, lastName);
  };

  return (
    <RegisterForm title={_(msg`Add your name`)} onSubmit={handleSubmit}>
      <TextInput
        isAutoFocused
        isRequired
        controlId="firstName"
        label={_(msg`First name`)}
        placeholder={_(msg`Enter your first name`)}
        value={firstName}
        className="mb-3"
        isValid={firstNameValid}
        isInvalid={firstNameInvalid}
        maxLength={20}
        onChange={handleFirstNameChange}
        onBlur={() => {
          setFirstName(firstName.trim());
        }}
      />
      <TextInput
        isRequired
        controlId="lastName"
        label={_(msg`Last name`)}
        placeholder={_(msg`Enter your last name`)}
        value={lastName}
        isValid={lastNameValid}
        isInvalid={lastNameInvalid}
        maxLength={25}
        onChange={handleLastNameChange}
        onBlur={() => {
          setLastName(lastName.trim());
        }}
      />
    </RegisterForm>
  );
}
