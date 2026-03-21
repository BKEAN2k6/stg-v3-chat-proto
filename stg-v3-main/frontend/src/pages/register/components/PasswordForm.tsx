import {msg} from '@lingui/core/macro';
import React, {useState} from 'react';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm.js';
import TextInput from '@/components/ui/TextInput.js';

type Properties = {
  readonly onSubmit: (password: string) => void;
};

export default function PasswordForm(properties: Properties) {
  const {_} = useLingui();
  const {onSubmit: onComlete} = properties;
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>();
  const [passwordInvalid, setPasswordInvalid] = useState<boolean | undefined>();

  const isPasswordValid = (password: string) => {
    return password.length >= 8;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setPassword(value);
    setPasswordValid(isPasswordValid(value));
    if (passwordInvalid) setPasswordInvalid(undefined);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComlete(password);
  };

  return (
    <RegisterForm title={_(msg`Enter your password`)} onSubmit={handleSubmit}>
      <TextInput
        isRequired
        controlId="password"
        name="password"
        autoComplete="new-password"
        label={_(msg`Your password`)}
        type="password"
        placeholder={_(msg`Enter your password`)}
        value={password}
        instructionText={_(
          msg`Your password must be at least 8 characters long.`,
        )}
        isValid={passwordValid && passwordValid ? true : undefined}
        isInvalid={passwordInvalid && passwordInvalid ? true : undefined}
        onChange={handlePasswordChange}
      />
    </RegisterForm>
  );
}
