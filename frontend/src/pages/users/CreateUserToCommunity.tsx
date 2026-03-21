import {useEffect, useState} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import {type LanguageCode, type GetCommunitiesResponse} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import {type ArrayElement} from '@/helpers/types.js';
import countries from '@/countries.js';
import {useGetCommunitiesQuery} from '@/hooks/useApi.js';

export default function CreateUserToCommunity() {
  const toasts = useToasts();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [country, setCountry] = useState('FIN');
  const [organization, setOrganization] = useState('');
  const [organizationType, setOrganizationType] = useState(
    'Early childhood education',
  );
  const [organizationRole, setOrganizationRole] = useState(
    'Principal / Manager',
  );
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCommunities, setSelectedCommunities] =
    useState<GetCommunitiesResponse>([]);
  const selectedCommmunity = selectedCommunities[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const searchQuery = useGetCommunitiesQuery(
    debouncedSearchTerm
      ? {search: debouncedSearchTerm, limit: '1000'}
      : undefined,
    {enabled: debouncedSearchTerm.length >= 3},
  );
  const searchResult = searchQuery.data ?? [];
  const isLoading = searchQuery.isFetching;

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCommmunity) {
      return;
    }

    try {
      await api.createUserToCommunity(
        {id: selectedCommmunity.id},
        {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          language,
          country,
          organization: organization.trim(),
          organizationType,
          organizationRole: organizationRole.trim(),
          role,
        },
      );
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
            onSearch={() => undefined}
            onInputChange={(value) => {
              setSearchTerm(value);
              if (value.trim().length < 3) {
                setDebouncedSearchTerm('');
              }
            }}
          />
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCommunities([]);
              setSearchTerm('');
              setDebouncedSearchTerm('');
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
      <Form.Group className="mb-3">
        <Form.Label>Country</Form.Label>

        <Form.Select
          aria-label="Country"
          value={country}
          onChange={(event) => {
            setCountry(event.target.value);
          }}
        >
          {countries.map(({code, name}) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Language</Form.Label>

        <Form.Select
          aria-label="Language"
          value={language}
          onChange={(event) => {
            setLanguage(event.target.value as LanguageCode);
          }}
        >
          <option value="en">English</option>
          <option value="fi">Finnish</option>
          <option value="sv">Swedish</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Organization name</Form.Label>
        <Form.Control
          required
          type="organization"
          placeholder="Organization name"
          value={organization}
          maxLength={320}
          onChange={(event) => {
            setOrganization(event.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Organization type</Form.Label>

        <Form.Select
          aria-label="Organization type"
          value={organizationType}
          onChange={(event) => {
            setOrganizationType(event.target.value);
          }}
        >
          <option value="Early childhood education">
            Early childhood education
          </option>
          <option value="School">School</option>
          <option value="Other">Other</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Organization role</Form.Label>

        <Form.Select
          aria-label="Organization role"
          value={organizationRole}
          onChange={(event) => {
            setOrganizationRole(event.target.value);
          }}
        >
          <option value="Principal / Manager">Principal / Manager</option>
          <option value="Teacher / Instructor">Teacher / Instructor</option>
          <option value="Other">Other</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Create
      </Button>
    </Form>
  );
}
