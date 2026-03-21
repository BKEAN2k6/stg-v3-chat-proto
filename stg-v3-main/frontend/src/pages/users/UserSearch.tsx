import {useState, useEffect} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {type GetUsersResponse, type GetUserResponse} from '@client/ApiTypes';
import api from '@client/ApiClient';
import UserEditForm from './UserEditForm.js';
import UserCommunities from './UserCommunities.js';
import {useToasts} from '@/components/toasts/index.js';
import {useTitle} from '@/context/pageTitleContext.js';

export default function UserSearchPage() {
  const toasts = useToasts();
  const {setTitle} = useTitle();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<GetUsersResponse>([]);
  const [selectedUsers, setSelectedUsers] = useState<GetUserResponse[]>([]);
  const selectedUser = selectedUsers[0];

  useEffect(() => {
    setTitle('Users');
  }, [setTitle]);

  const handleSearch = async (search: string) => {
    setIsLoading(true);
    try {
      const users = await api.getUsers({search, limit: '1000'});
      setSearchResult(users);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while searching for users',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <InputGroup className="mb-3">
        <AsyncTypeahead
          filterBy={() => true}
          id="user-search"
          minLength={3}
          options={searchResult}
          selected={selectedUsers}
          isLoading={isLoading}
          // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
          labelKey={({firstName, lastName}: GetUserResponse) =>
            `${firstName} ${lastName}`
          }
          placeholder="Search for a user by first name, last name or email"
          // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
          renderMenuItemChildren={({
            firstName,
            lastName,
            email,
          }: GetUserResponse) => `${firstName} ${lastName} (${email})`}
          onChange={(user) => {
            // @ts-expect-error https://github.com/ericgio/react-bootstrap-typeahead/issues/704
            setSelectedUsers(user);
          }}
          onSearch={handleSearch}
        />
        <Button
          variant="primary"
          onClick={() => {
            setSelectedUsers([]);
            setSearchResult([]);
          }}
        >
          Clear
        </Button>
      </InputGroup>

      {selectedUser ? (
        <Tabs defaultActiveKey="details" id="user-edit-tabs" className="mb-3">
          <Tab eventKey="details" title="User Details">
            <UserEditForm
              key={selectedUser.id}
              id={selectedUser.id}
              firstName={selectedUser.firstName}
              lastName={selectedUser.lastName}
              email={selectedUser.email}
              isEmailVerified={selectedUser.isEmailVerified}
              roles={selectedUser.roles}
            />
          </Tab>
          <Tab eventKey="communities" title="Communities">
            <UserCommunities userId={selectedUser.id} />
          </Tab>
        </Tabs>
      ) : null}
    </>
  );
}
