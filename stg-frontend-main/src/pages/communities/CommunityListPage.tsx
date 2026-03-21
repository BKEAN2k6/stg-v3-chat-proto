import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Table, Button} from 'react-bootstrap';
import CreateCommunityModal from './CreateCommunityModal';
import api from '@/api/ApiClient';
import MenuPageLoader from '@/components/MenuPageLoader';
import {
  type CreateCommunityResponse,
  type GetCommunitiesResponse,
} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import {useTitle} from '@/context/pageTitleContext';

const sortCommunities = (communities: GetCommunitiesResponse) => {
  return communities.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
};

export default function CommunityListPage() {
  const toasts = useToasts();
  const {setTitle} = useTitle();
  const [communities, setCommunities] = useState<GetCommunitiesResponse>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTitle('Communities');
  }, [setTitle]);

  const onCommunityCreate = (community: CreateCommunityResponse) => {
    communities.push(community);
    setCommunities(sortCommunities(communities));
  };

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const communities = await api.getCommunities({
          limit: '1000',
        });
        setCommunities(sortCommunities(communities));
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while loading the communities',
        });
      }
    };

    void getCommunities();
  }, [toasts]);

  if (!communities) {
    return <MenuPageLoader />;
  }

  return (
    <div>
      <Button
        className="mb-3 float-end"
        variant="primary"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Add new
      </Button>

      <Table striped bordered hover>
        <tbody>
          {communities.map((community, index) => (
            <tr key={community._id}>
              <td
                style={{
                  width: '50px',
                  textAlign: 'center',
                }}
              >
                {index + 1}
              </td>
              <td>
                <Link to={`/communities/${community._id}/settings`}>
                  {community.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CreateCommunityModal
        isOpen={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        onCommunityCreate={onCommunityCreate}
      />
    </div>
  );
}
