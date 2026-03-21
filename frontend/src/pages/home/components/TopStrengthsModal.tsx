import {Plural, Trans} from '@lingui/react/macro';
import {Modal} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {type CommunityStats} from '@client/ApiTypes';
import {strengthName} from '@/helpers/strengths.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';

type Properties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly strengthList: CommunityStats['topStrengths'];
  readonly totalStrengths: number;
};

export default function TopStrengthsModal(properties: Properties) {
  const {i18n} = useLingui();
  const {isOpen, onClose, strengthList, totalStrengths} = properties;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Trans>Top strengths</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        <div className="d-flex flex-row align-items-end gap-2 mb-2">
          <h4 className="m-0">{totalStrengths}</h4>
          <span>
            <Plural
              value={totalStrengths}
              one="Strength this week"
              other="Strengths this week"
            />
          </span>
        </div>
        {strengthList.map((topStrength) => (
          <div
            key={topStrength.strength}
            className="d-flex align-items-center py-2 px-2"
          >
            <StrengthAvatar strength={topStrength.strength} />
            <div className="ms-3">
              <span className="mb-0 fw-semibold">
                {strengthName(topStrength.strength, i18n.locale)} •{' '}
                {topStrength.count}
              </span>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
