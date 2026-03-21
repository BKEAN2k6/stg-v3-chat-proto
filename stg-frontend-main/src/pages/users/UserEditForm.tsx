import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';

type Props = {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly isEmailVerified: boolean;
  readonly roles: Array<'super-admin'>;
};

export default function UserEditForm(props: Props) {
  const toasts = useToasts();
  const {id} = props;
  const [firstName, setFirstName] = useState<string>(props.firstName);
  const [lastName, setLastName] = useState<string>(props.lastName);
  const [email, setEmail] = useState<string>(props.email);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(
    props.isEmailVerified,
  );
  const [roles, setRoles] = useState<Array<'super-admin'>>(props.roles);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.updateUser(
        {id},
        {firstName, lastName, email, isEmailVerified, roles, password},
      );

      toasts.success({
        header: 'Success!',
        body: 'The user has been saved',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the user',
      });
    }
  };

  return (
    <Form autoComplete="off" onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="firstName">
        <Form.Label>First name</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          placeholder="First name"
          value={firstName}
          maxLength={20}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Label>Last name</Form.Label>
        <Form.Control
          type="text"
          autoComplete="off"
          placeholder="Last Name"
          value={lastName}
          maxLength={25}
          onChange={(event) => {
            setLastName(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          autoComplete="off"
          placeholder="Email"
          defaultValue={email}
          maxLength={320}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="isEmailVerified">
        <Form.Check
          type="checkbox"
          checked={isEmailVerified}
          label="Email verified"
          onChange={(event) => {
            setIsEmailVerified(event.target.checked);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          onChange={(event) => {
            if (event.target.value === '') {
              setPassword(undefined);
              return;
            }

            setPassword(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Label>Roles</Form.Label>
      <Form.Group className="mb-3" controlId="roles">
        <Form.Check
          type="checkbox"
          checked={roles.includes('super-admin')}
          label="Super Admin"
          onChange={(event) => {
            if (event.target.checked) {
              setRoles([...roles, 'super-admin']);
              return;
            }

            setRoles(roles.filter((role) => role !== 'super-admin'));
          }}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
}
