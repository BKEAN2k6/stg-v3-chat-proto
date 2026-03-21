import React, {useState} from 'react';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import RegisterForm from './RegisterForm';
import TextInput from '@/components/ui/TextInput';

type Props = {
  readonly onSubmit: (email: string) => void;
};

export default function EmailForm(props: Props) {
  const {onSubmit: onComlete} = props;
  const {_} = useLingui();

  const [email, setEmail] = useState<string>('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;

    setEmail(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComlete(email);
  };

  return (
    <RegisterForm title={_(msg`Enter your email`)} onSubmit={handleSubmit}>
      <TextInput
        isRequired
        autoFocus
        controlId="email"
        name="new-email"
        label={_(msg`Your email`)}
        type="email"
        placeholder={_(msg`Enter your email`)}
        value={email}
        maxLength={320}
        onChange={handleEmailChange}
      />
    </RegisterForm>
  );
}
