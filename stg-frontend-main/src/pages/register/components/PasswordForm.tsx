import React, {useState} from 'react';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm';
import TextInput from '@/components/ui/TextInput';

type Props = {
  readonly onSubmit: (password: string) => void;
};

export default function PasswordForm(props: Props) {
  const {_} = useLingui();
  const {onSubmit: onComlete} = props;
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>();
  const [passwordInvalid, setPasswordInvalid] = useState<boolean | undefined>();

  const isPasswordValid = (password: string) => {
    return password.length >= 8 && /\d/.test(password);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setPassword(value);
    setPasswordValid(isPasswordValid(value));
    if (passwordInvalid) setPasswordInvalid(undefined);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
          msg`Your password must be at least 8 characters long and contain at least one number.`,
        )}
        isValid={passwordValid && passwordValid ? true : undefined}
        isInvalid={passwordInvalid && passwordInvalid ? true : undefined}
        onChange={handlePasswordChange}
      />
    </RegisterForm>
  );
}
