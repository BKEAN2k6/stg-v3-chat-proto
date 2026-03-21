import {useState} from 'react';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';

type Props = {
  readonly communityId: string;
};

export default function CreateUserToCommunity(props: Props) {
  const toasts = useToasts();
  const {_} = useLingui();
  const {communityId} = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await api.createUserToCommunity(
        {id: communityId},
        {
          destination: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          language: 'en',
          role,
        },
      );

      setRole('member');
      setFirstName('');
      setLastName('');
      setEmail('');

      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`The user been created to the community`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(
          msg`Something went wrong while creating the user to the community. Most likely an user with the same email already exists.`,
        ),
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>
          <Trans>Role</Trans>
        </Form.Label>
        <Form.Select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as 'admin' | 'member');
          }}
        >
          <option value="member">
            <Trans>Member</Trans>
          </option>
          <option value="admin">
            <Trans>Admin</Trans>
          </option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          {' '}
          <Trans>First name</Trans>
        </Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="First name"
          value={firstName}
          maxLength={20}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          <Trans>Last name</Trans>
        </Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Last name"
          value={lastName}
          maxLength={25}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          <Trans>Email</Trans>
        </Form.Label>
        <Form.Control
          required
          type="email"
          placeholder="Email"
          value={email}
          maxLength={320}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create
      </Button>
    </Form>
  );
}
