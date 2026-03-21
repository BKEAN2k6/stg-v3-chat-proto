import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UserSearch from './UserSearch.js';
import CreateUserToCommunity from './CreateUserToCommunity.js';
import PageTitle from '@/components/ui/PageTitle.js';

function UsersPage() {
  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Users" />
      <Tabs defaultActiveKey="user-search" id="users-tabs" className="mb-3">
        <Tab eventKey="user-search" title="Search">
          <UserSearch />
        </Tab>
        <Tab eventKey="create" title="Create">
          <CreateUserToCommunity />
        </Tab>
      </Tabs>
    </div>
  );
}

export default UsersPage;
