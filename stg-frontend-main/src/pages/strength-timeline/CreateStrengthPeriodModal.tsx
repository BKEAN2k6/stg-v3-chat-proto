import {Modal, Button} from 'react-bootstrap';
import StrengthPeriodForm from './StrengthPeriodForm';
import {
  type StrengthPeriod,
  type ArticleCategoryListItem,
} from '@/api/ApiTypes';

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly onChange: (period: StrengthPeriod) => void;
  readonly categories: ArticleCategoryListItem[];
  readonly period: StrengthPeriod;
};

function isValidPeriod(period: StrengthPeriod) {
  return (
    period.timeline.every((item) => item.articleId) &&
    period.timeline.every(
      (item, index) =>
        index === 0 ||
        new Date(item.start) > new Date(period.timeline[index - 1].start),
    )
  );
}

export default function CreatetrengthPeriodModal(props: Props) {
  const {isOpen, onClose, onSave, onChange, categories, period} = props;

  const canSubmit = isValidPeriod(period);

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Strength Period</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StrengthPeriodForm
          period={period}
          categories={categories}
          onChange={onChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={!canSubmit}
          variant="primary"
          onClick={() => {
            onSave();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
