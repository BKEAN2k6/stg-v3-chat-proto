import React, {useState} from 'react';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm';
import TextInput from '@/components/ui/TextInput';

type Props = {
  readonly onSubmit: (firstName: string, lastName: string) => void;
};

export default function NamesForm(props: Props) {
  const {_} = useLingui();
  const {onSubmit: onComlete} = props;

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
    setFirstNameInvalid(!value);
    setFirstNameValid(value.length > 0);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setLastName(value);
    setLastNameInvalid(!value);
    setLastNameValid(value.length > 0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComlete(firstName, lastName);
  };

  return (
    <RegisterForm title={_(msg`Add your name`)} onSubmit={handleSubmit}>
      <TextInput
        autoFocus
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
      />
    </RegisterForm>
  );
}
