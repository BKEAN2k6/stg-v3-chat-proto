import {useState} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import {useToasts} from '@/components/toasts';
import {type GetCommunitiesResponse} from '@/api/ApiTypes';
import {type ArrayElement} from '@/helpers/types';
import api from '@/api/ApiClient';

export default function CreateUserToCommunity() {
  const toasts = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [searchResult, setSearchResult] = useState<GetCommunitiesResponse>([]);
  const [selectedCommunities, setSelectedCommunities] =
    useState<GetCommunitiesResponse>([]);
  const selectedCommmunity = selectedCommunities[0];

  const handleSearch = async (search: string) => {
    setIsLoading(true);
    try {
      const communities = await api.getCommunities({search, limit: '1000'});
      setSearchResult(communities);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while searching for communities',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCommmunity) {
      return;
    }

    try {
      await api.createUserToCommunity(
        {id: selectedCommmunity._id},
        {
          destination: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          language: 'en',
          role,
        },
      );
      setSearchResult([]);
      setSelectedCommunities([]);
      setRole('member');
      setFirstName('');
      setLastName('');
      setEmail('');

      toasts.success({
        header: 'Success!',
        body: 'The user been created to the community',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong whilecreating the user to the community',
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Community</Form.Label>
        <InputGroup className="mb-3">
          <AsyncTypeahead
            filterBy={() => true}
            id="user-search"
            minLength={3}
            options={searchResult}
            selected={selectedCommunities}
            isLoading={isLoading}
            // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
            labelKey={({name}: ArrayElement<GetCommunitiesResponse>) =>
              `${name}`
            }
            placeholder="Search for a community by name"
            // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
            renderMenuItemChildren={({
              name,
            }: ArrayElement<GetCommunitiesResponse>) => `${name}`}
            onChange={(communities) => {
              // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
              setSelectedCommunities(communities);
            }}
            onSearch={handleSearch}
          />
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCommunities([]);
              setSearchResult([]);
            }}
          >
            Clear
          </Button>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as 'admin' | 'member');
          }}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>First name</Form.Label>
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
        <Form.Label>Last name</Form.Label>
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
        <Form.Label>Email</Form.Label>
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
