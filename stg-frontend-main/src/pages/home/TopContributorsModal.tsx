import {Modal} from 'react-bootstrap';
import {Plural, Trans} from '@lingui/macro';
import Avatar from '@/components/ui/Avatar';
import {type CommunityStats} from '@/api/ApiTypes';
import {colorFromId, formatName} from '@/helpers/avatars';

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly contributorList: CommunityStats['leaderboard'];
  readonly totalContributors: number;
};

export default function TopContributorsModal(props: Props) {
  const {isOpen, onClose, totalContributors, contributorList} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Trans>Top contributors</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <div className="d-flex flex-row align-items-end gap-2 mb-2">
          <h4 className="m-0">{totalContributors}</h4>
          <span>
            <Plural
              value={totalContributors}
              one="Contributor this week"
              other="Contributors this week"
            />
          </span>
        </div>
        {contributorList.map((user) => (
          <div key={user._id} className="d-flex align-items-center py-2 px-2">
            <Avatar
              size={40}
              name={formatName(user)}
              path={user.avatar}
              color={colorFromId(user._id)}
            />
            <div className="ms-3">
              <span className="mb-0 fw-semibold">
                {formatName(user)} • {user.count}
              </span>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
