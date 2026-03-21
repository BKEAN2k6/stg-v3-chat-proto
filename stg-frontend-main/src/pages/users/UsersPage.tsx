import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UserSearch from './UserSearch';
import CreateUserToCommunity from './CreateUserToCommunity';

function UsersPage() {
  return (
    <Tabs defaultActiveKey="user-search" id="users-tabs" className="mb-3">
      <Tab eventKey="user-search" title="Search">
        <UserSearch />
      </Tab>
      <Tab eventKey="create" title="Create">
        <CreateUserToCommunity />
      </Tab>
    </Tabs>
  );
}

export default UsersPage;
