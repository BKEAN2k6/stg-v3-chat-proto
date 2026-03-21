import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';

export default function EmailAuthPage() {
  const toasts = useToasts();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [code, setCode] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleInvitationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInvitationCode(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const {code} = await api.emailAuth({
        destination: email,
        isRegistration: true,
        resetPassword: true,
        firstName,
        lastName,
        invitationCode,
      });
      setCode(code);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong.',
      });
    }
  };

  if (code) {
    return (
      <Container>
        <p>
          A code has been sent to your email. Please enter it below to reset
          your password.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            onChange={handleEmailChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="first-name">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            maxLength={20}
            onChange={handleFirstNameChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="last-name">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            maxLength={25}
            onChange={handleLastNameChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="join-code">
          <Form.Label>Invitation Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Invitation code"
            onChange={handleInvitationCodeChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
