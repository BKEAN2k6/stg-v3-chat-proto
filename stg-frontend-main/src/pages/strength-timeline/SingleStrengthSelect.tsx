import {useState} from 'react';
import {Form, InputGroup, Button} from 'react-bootstrap';
import StrengthModal from '@/components/ui/StrengthModal';
import {type StrengthSlug} from '@/api/ApiTypes';
import {strengthTranslationMap} from '@/helpers/strengths';

type Props = {
  readonly strength: StrengthSlug;
  readonly onChange: (updatedStrength: StrengthSlug) => void;
  readonly className?: string;
};

export default function SingleStrengthSelect(props: Props) {
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const {strength, onChange, className} = props;

  return (
    <InputGroup className={className}>
      <InputGroup.Text>Strength</InputGroup.Text>
      <Form.Control
        disabled
        type="text"
        name="strength"
        value={strengthTranslationMap[strength].en}
        onClick={() => {
          setIsStrengthModalOpen(true);
        }}
      />
      <Button
        variant="primary"
        onClick={() => {
          setIsStrengthModalOpen(true);
        }}
      >
        Select
      </Button>
      <StrengthModal
        isOpen={isStrengthModalOpen}
        selectedStrengthSlugs={[strength]}
        onClose={() => {
          setIsStrengthModalOpen(false);
        }}
        onStrengthSelected={(strength) => {
          onChange(strength);
          setIsStrengthModalOpen(false);
        }}
      />
    </InputGroup>
  );
}
