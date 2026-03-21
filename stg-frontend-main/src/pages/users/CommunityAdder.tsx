import {useState} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import {Plus} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useToasts} from '@/components/toasts';
import {type GetCommunitiesResponse} from '@/api/ApiTypes';
import {type ArrayElement} from '@/helpers/types';
import api from '@/api/ApiClient';

type AddedCommunity = {
  readonly _id: string;
  readonly name: string;
  role: 'admin' | 'member';
};

type Props = {
  readonly userId: string;
  readonly onCommunityAdd: (community: AddedCommunity) => void;
};

export default function CommunityAdder(props: Props) {
  const toasts = useToasts();
  const {userId, onCommunityAdd} = props;
  const [isLoading, setIsLoading] = useState(false);
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
        body: 'Something went wrong while searching for users',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedCommmunity) {
      return;
    }

    try {
      const {_id, name} = selectedCommmunity;
      await api.upsertCommunityMember(
        {
          id: _id,
          userId,
        },
        {role},
      );

      setSelectedCommunities([]);
      setSearchResult([]);
      onCommunityAdd({_id, name, role});
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
          onSearch={handleSearch}
        />
      </Col>
      <Col xs={3}>
        <Form.Select
          size="sm"
          value={role}
          onChange={(event) => {
            setRole(event.target.value as 'admin' | 'member');
          }}
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </Form.Select>
      </Col>
      <Col xs={1} className="float-right">
        <Button
          variant="primary"
          size="sm"
          disabled={!selectedCommmunity}
          onClick={async () => {
            setSelectedCommunities([]);
            setSearchResult([]);
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
