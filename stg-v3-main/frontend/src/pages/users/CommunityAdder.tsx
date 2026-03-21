import {useEffect, useState} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import {Plus} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import api from '@client/ApiClient.js';
import {type GetCommunitiesResponse} from '@client/ApiTypes';
import {useGetCommunitiesQuery} from '@client/ApiHooks.js';
import {useToasts} from '@/components/toasts/index.js';
import {type ArrayElement} from '@/helpers/types.js';

type AddedCommunity = {
  readonly id: string;
  readonly name: string;
  role: 'admin' | 'member' | 'owner';
};

type Properties = {
  readonly userId: string;
  readonly onCommunityAdd: (community: AddedCommunity) => void;
};

export default function CommunityAdder(properties: Properties) {
  const toasts = useToasts();
  const {userId, onCommunityAdd} = properties;
  const [role, setRole] = useState<'admin' | 'member' | 'owner'>('member');
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

  const handleAdd = async () => {
    if (!selectedCommmunity) {
      return;
    }

    try {
      const {id, name} = selectedCommmunity;

      await api.upsertCommunityMember(
        {
          id,
          userId,
        },
        {role},
      );

      setSelectedCommunities([]);
      onCommunityAdd({id, name, role});
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while adding the user to the community',
      });
    }
  };

  return (
    <Row>
      <Col xs={8}>
        <AsyncTypeahead
          filterBy={() => true}
          id="user-search"
          minLength={3}
          size="sm"
          options={searchResult}
          selected={selectedCommunities}
          isLoading={isLoading}
          // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
          labelKey={({name}: ArrayElement<GetCommunitiesResponse>) => `${name}`}
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
      </Col>

      <Col xs={3}>
        <Form.Select
          value={role}
          size="sm"
          onChange={async (event) => {
            setRole(event.target.value as 'admin' | 'member' | 'owner');
          }}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </Form.Select>
      </Col>
      <Col xs={1} className="float-right">
        <Button
          variant="primary"
          size="sm"
          disabled={!selectedCommmunity}
          onClick={async () => {
            setSelectedCommunities([]);
            await handleAdd();
            setRole('member');
          }}
        >
          <Plus />
        </Button>
      </Col>
    </Row>
  );
}
