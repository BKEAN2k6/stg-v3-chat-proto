import {msg} from '@lingui/core/macro';
import React, {useState} from 'react';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm.js';
import TextInput from '@/components/ui/TextInput.js';

type Properties = {
  readonly onSubmit: (email: string) => void;
};

export default function EmailForm(properties: Properties) {
  const {onSubmit: onComlete} = properties;
  const {_} = useLingui();

  const [email, setEmail] = useState<string>('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;

    setEmail(value);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComlete(email);
  };

  return (
    <RegisterForm title={_(msg`Enter your email`)} onSubmit={handleSubmit}>
      <TextInput
        isRequired
        isAutoFocused
        controlId="email"
        name="new-email"
        label={_(msg`Your email`)}
        type="email"
        placeholder={_(msg`Enter your email`)}
        value={email}
        maxLength={320}
        onChange={handleEmailChange}
        onBlur={() => {
          setEmail(email.trim());
        }}
      />
    </RegisterForm>
  );
}
