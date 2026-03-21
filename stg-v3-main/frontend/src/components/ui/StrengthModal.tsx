import {Trans} from '@lingui/react/macro';
import {Modal} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {type StrengthSlug} from '@client/ApiTypes';
import ListItem from './ListItem.js';
import {
  type StrengthListItem,
  simpleStrengthSlugs,
  slugToListItem,
  strengthSlugs,
} from '@/helpers/strengths.js';

const selectStrengthTranslations: Record<string, string> = {
  en: 'Select strength',
  fi: 'Valitse vahvuus',
  sv: 'Välj styrka',
};

type Properties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedStrengthSlugs?: StrengthSlug[];
  readonly onStrengthSelected: (strength: StrengthSlug) => void;
  readonly hasSimpleStrengthsOnly?: boolean;
  readonly locale?: string;
};

export default function StrengthModal(properties: Properties) {
  const {i18n} = useLingui();
  const {
    isOpen,
    onClose,
    selectedStrengthSlugs,
    hasSimpleStrengthsOnly,
    onStrengthSelected,
    locale,
  } = properties;

  const effectiveLocale = locale ?? i18n.locale;

  const strengths: StrengthListItem[] = (
    hasSimpleStrengthsOnly ? simpleStrengthSlugs : strengthSlugs
  )
    .filter(
      (slug) => selectedStrengthSlugs && !selectedStrengthSlugs.includes(slug),
    )
    .map((slug) => slugToListItem(slug, effectiveLocale))
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleClose = () => {
    onClose();
  };

  const handleSelect = (strength: StrengthSlug) => {
    onStrengthSelected(strength);
  };

  const modalTitle = locale
    ? (selectStrengthTranslations[locale] ?? selectStrengthTranslations.en)
    : undefined;

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
          {modalTitle ?? <Trans>Select strength</Trans>}
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
