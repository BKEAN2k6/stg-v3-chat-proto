import {Modal, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {type Reaction} from '@/api/ApiTypes';
import {colorFromId, formatName} from '@/helpers/avatars';
import Avatar from '@/components/ui/Avatar';
import {strengthName} from '@/helpers/strengths';
import {getUniqueReactions, reactionIcons} from '@/helpers/reactions';

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly reactions: Reaction[];
};

export default function ReactionsModal(props: Props) {
  const {i18n} = useLingui();
  const {isOpen, onClose, reactions} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Trans>Reactions</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        <div className="d-flex flex-row align-items-center gap-3 mb-2 px-2 text-body-secondary">
          <span className="m-0">
            <Trans>Total</Trans> • {reactions.length}
          </span>
          {getUniqueReactions(reactions).map((type) => (
            <OverlayTrigger
              key={`reaction-modal-reaction-${type}`}
              overlay={
                <Tooltip>
                  {strengthName(type, i18n.locale)} •{' '}
                  {reactions.filter((t) => t.type === type).length}
                </Tooltip>
              }
            >
              <div className="d-flex align-items-center gap-1">
                <span className="d-none d-sm-inline">
                  {reactions.filter((t) => t.type === type).length}
                </span>
                <img
                  src={reactionIcons[type]}
                  alt={type}
                  style={{width: 12, height: 12}}
                />
              </div>
            </OverlayTrigger>
          ))}
        </div>
        <hr className="mt-0 mb-2" />
        {reactions.map((reaction) => (
          <div
            key={`reaction-modal-${reaction._id}`}
            className="d-flex align-items-center py-2 px-2"
          >
            <Avatar
              size={40}
              name={formatName(reaction.createdBy)}
              path={reaction.createdBy.avatar}
              color={colorFromId(reaction.createdBy._id)}
            />
            <div className="ms-3 d-flex flex-column">
              <span className="mb-0 fw-semibold">
                {formatName(reaction.createdBy)}
              </span>
              <span>{strengthName(reaction.type, i18n.locale)}</span>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
