import {Modal} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import ListItem from './ListItem';
import {
  type StrengthListItem,
  simpleStrengthSlugs,
  slugToListItem,
  strengthSlugs,
} from '@/helpers/strengths';
import {type StrengthSlug} from '@/api/ApiTypes';

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedStrengthSlugs?: StrengthSlug[];
  readonly onStrengthSelected: (strength: StrengthSlug) => void;
  readonly hasSimpleStrengthsOnly?: boolean;
};

export default function StrengthModal(props: Props) {
  const {i18n} = useLingui();
  const {
    isOpen,
    onClose,
    selectedStrengthSlugs,
    hasSimpleStrengthsOnly,
    onStrengthSelected,
  } = props;

  const strengths: StrengthListItem[] = (
    hasSimpleStrengthsOnly ? simpleStrengthSlugs : strengthSlugs
  )
    .filter(
      (slug) => selectedStrengthSlugs && !selectedStrengthSlugs.includes(slug),
    )
    .map((slug) => slugToListItem(slug, i18n.locale))
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleClose = () => {
    onClose();
  };

  const handleSelect = (strength: StrengthSlug) => {
    onStrengthSelected(strength);
  };

  return (
    <Modal
      scrollable
      centered
      show={isOpen}
      className="px-4"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Trans>Select strength</Trans>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        {strengths.map((strength) => (
          <ListItem
            key={strength.slug}
            imageUrl={strength.imageUrl}
            imageAlt={strength.title}
            imageBackgroundColor={strength.color}
            title={strength.title}
            description={strength.description}
            onClick={() => {
              handleSelect(strength.slug);
            }}
          />
        ))}
      </Modal.Body>
    </Modal>
  );
}
