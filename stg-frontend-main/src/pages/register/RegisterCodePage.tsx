import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useNavigate} from 'react-router-dom';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import CodeInput from '@/components/ui/CodeInput';
import OnboardingFlowLayout from '@/layouts/OnboardingFlowLayout';
import Logo from '@/components/ui/Logo';

export default function RegisterCodePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [invitationCode, setInvitationCode] = useState('');
  const [codeInputIsInvalid, setCodeInputIsInvalid] = useState(false);

  const navigate = useNavigate();

  const handleInvitationCodeChange = (newValue: string) => {
    setInvitationCode(newValue);
    setCodeInputIsInvalid(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (invitationCode.length < 6) {
      setCodeInputIsInvalid(true);
      toasts.danger({
        header: _(msg`No code provided.`),
        body: _(msg`Please provide an invitation code.`),
      });
      return;
    }

    try {
      await api.getCommunityInvitationWithCode({
        code: invitationCode,
      });
      navigate(`/register/user?invitationCode=${invitationCode}`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'Invitation not found') {
        toasts.danger({
          header: _(msg`Invitation not found.`),
          body: _(msg`Check the code and try again.`),
        });
        return;
      }

      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong.`),
      });
    }
  };

  return (
    <OnboardingFlowLayout>
      <Logo className="mb-5" color="#fdd662" height={64} width={64} />
      <Form className="w-100 text-center" onSubmit={handleSubmit}>
        <h1 className="display-6 mb-5 text-center">
          <Trans>Enter code to join your community</Trans>
        </h1>
        <CodeInput
          controlId="invitationCode"
          isInvalid={codeInputIsInvalid}
          className="mb-5"
          onChange={handleInvitationCodeChange}
        />
        <Button variant="primary" type="submit" style={{width: 150}}>
          <Trans>Continue</Trans>
        </Button>
      </Form>
    </OnboardingFlowLayout>
  );
}
