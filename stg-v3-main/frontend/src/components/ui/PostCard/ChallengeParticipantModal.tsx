import {Trans} from '@lingui/react/macro';
import {Modal} from 'react-bootstrap';
import {type UserInfo} from '@client/ApiTypes';
import Avatar from '@/components/ui/Avatar.js';
import {colorFromId, formatName} from '@/helpers/avatars.js';

type Properties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly users: UserInfo[];
};

export default function ChallengeParticipantModal(properties: Properties) {
  const {isOpen, onClose, users} = properties;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Trans>Challenge participants</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        {users.map((user) => (
          <div key={user.id} className="d-flex align-items-center py-2 px-2">
            <Avatar
              size={40}
              name={formatName(user)}
              path={user.avatar}
              color={colorFromId(user.id)}
            />
            <div className="ms-3">
              <span className="mb-0 fw-semibold">{formatName(user)}</span>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
