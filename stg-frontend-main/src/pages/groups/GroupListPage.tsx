import {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {Pen} from 'react-bootstrap-icons';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import EditGroupModal from './EditGroupModal';
import {useCurrentUser} from '@/context/currentUserContext';
import {useTitle} from '@/context/pageTitleContext';
import api from '@/api/ApiClient';
import MenuPageLoader from '@/components/MenuPageLoader';
import {
  type GetGroupResponse,
  type GetCommunityGroupsResponse,
} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';

export default function GroupListPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {setTitle} = useTitle();
  const {currentUser} = useCurrentUser();
  const [groups, setGroups] = useState<GetCommunityGroupsResponse>();
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GetGroupResponse>();

  useEffect(() => {
    setTitle(_(msg`Groups`));
  }, [setTitle, _]);

  const onGroupUpdate = (group: GetGroupResponse) => {
    if (!groups) {
      return;
    }

    const index: number = groups.findIndex(
      (g: GetGroupResponse) => g._id === group._id,
    );
    if (index >= 0) {
      groups[index] = group;
    } else {
      groups.push(group);
    }

    setGroups([...groups]);
  };

  useEffect(() => {
    const getGroups = async () => {
      if (!currentUser) {
        return;
      }

      try {
        const groups = await api.getCommunityGroups({
          id: currentUser.selectedCommunity,
        });
        setGroups(groups);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while getting groups`),
        });
      }
    };

    void getGroups();
  }, [currentUser, toasts, _]);
  if (!groups) {
    return <MenuPageLoader />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between bg-light">
        <h1>
          <Trans>Groups</Trans>
        </h1>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedGroup(undefined);
            setShowModal(true);
          }}
        >
          <Trans>Add new</Trans>
        </Button>
      </div>

      {groups.map((group) => (
        <div key={group._id}>
          <h5>
            {group.name}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedGroup(group);
                setShowModal(true);
              }}
            >
              <Pen />
            </Button>
          </h5>
        </div>
      ))}
      <EditGroupModal
        isOpen={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        group={selectedGroup}
        onGroupUpdate={onGroupUpdate}
      />
    </div>
  );
}
